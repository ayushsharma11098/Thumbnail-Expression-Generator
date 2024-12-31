import Replicate from 'replicate';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { createCanvas, loadImage } from 'canvas';

export const config = {
  api: {
    bodyParser: false,
  },
};

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function addTextToImage(imageBuffer, text, textSettings) {
  const originalImage = sharp(imageBuffer);
  const metadata = await originalImage.metadata();

  let width = 1280;
  let height = Math.round((width / metadata.width) * metadata.height);

  if (height > 720) {
    height = 720;
    width = Math.round((height / metadata.height) * metadata.width);
  }

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const image = await loadImage(imageBuffer);
  ctx.drawImage(image, 0, 0, width, height);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${textSettings.fontSize}px ${textSettings.fontFamily}`;

  let x = width / 2;
  let y;
  switch (textSettings.position) {
    case 'top':
      y = height * 0.2;
      break;
    case 'bottom':
      y = height * 0.8;
      break;
    default:
      y = height * 0.5;
  }

  if (textSettings.outlineWidth > 0) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = textSettings.outlineWidth;
    ctx.strokeText(text, x, y);
  }

  ctx.fillStyle = textSettings.color;
  ctx.fillText(text, x, y);

  return canvas.toBuffer('image/png');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    const text = fields.text[0];
    const textSettings = JSON.parse(fields.textSettings[0]);
    const templateId = fields.templateId?.[0];
    const image = files.image?.[0];

    // Read expression values from form data
    const expressionValues = {
      smile: parseFloat(fields.smile[0]),
      eyebrow: parseFloat(fields.eyebrow[0]),
      blink: parseFloat(fields.blink[0]),
      wink: parseFloat(fields.wink[0]),
      pupil_x: parseFloat(fields.pupil_x[0]),
      pupil_y: parseFloat(fields.pupil_y[0]),
      rotate_pitch: parseFloat(fields.rotate_pitch[0]),
      rotate_yaw: parseFloat(fields.rotate_yaw[0]),
      rotate_roll: parseFloat(fields.rotate_roll[0]),
    };

    let imageBuffer;
    let mimetype = 'image/jpeg';

    if (image) {
      imageBuffer = fs.readFileSync(image.filepath);
      mimetype = image.mimetype;

      const processedImage = await sharp(imageBuffer)
        .resize({
          width: 1280,
          height: 720,
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toBuffer();

      imageBuffer = processedImage;
    } else if (templateId) {
      const templatePath = path.join(process.cwd(), 'public', 'templates', `${templateId}.jpg`);
      imageBuffer = fs.readFileSync(templatePath);
    } else {
      return res.status(400).json({ error: 'Either an image or template must be provided' });
    }

    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:${mimetype};base64,${base64Image}`;

    const expressionOutput = await replicate.run(
      "fofr/expression-editor:bf913bc90e1c44ba288ba3942a538693b72e8cc7df576f3beebe56adc0a92b86",
      {
        input: {
          image: imageUrl,
          ...expressionValues,
          src_ratio: 1,
          crop_factor: 1.7,
          sample_ratio: 1,
          output_format: 'png',
          output_quality: 95,
        },
      }
    );

    const response = await fetch(expressionOutput[0]);
    const expressionImageBuffer = Buffer.from(await response.arrayBuffer());

    const finalImageBuffer = await addTextToImage(expressionImageBuffer, text, textSettings);

    const finalBase64 = `data:image/png;base64,${finalImageBuffer.toString('base64')}`;

    if (image && image.filepath) {
      fs.unlinkSync(image.filepath);
    }

    return res.status(200).json({ output: [finalBase64] });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return res.status(500).json({ error: 'Failed to generate thumbnail' });
  }
}