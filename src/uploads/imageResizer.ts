import fs from 'fs';
import sharp from 'sharp';
import sanitize from 'sanitize-filename';
import getImageSize from './getImageSize';
import fileExists from './fileExists';

function getOutputImage(sourceImage, size) {
  const extension = sourceImage.split('.').pop();
  const name = sanitize(sourceImage.substr(0, sourceImage.lastIndexOf('.')) || sourceImage);

  return {
    name,
    extension,
    width: size.width,
    height: size.height,
  };
}

export default async function resizeAndSave(staticPath, config, savedFilename, mimeType) {
  /**
   * Resize images according to image desired width and height and return sizes
   * @param config Object
   * @param uploadConfig Object
   * @param savedFilename String
   * @returns String[]
   */

  const { imageSizes } = config.upload;

  const sourceImage = `${staticPath}/${savedFilename}`;

  const dimensions = await getImageSize(sourceImage);

  const sizes = imageSizes
    .filter((desiredSize) => desiredSize.width < dimensions.width)
    .map(async (desiredSize) => {
      const outputImage = getOutputImage(savedFilename, desiredSize);
      const imageNameWithDimensions = `${outputImage.name}-${outputImage.width}x${outputImage.height}.${outputImage.extension}`;
      const imagePath = `${staticPath}/${imageNameWithDimensions}`;
      const fileAlreadyExists = await fileExists(imagePath);

      if (fileAlreadyExists) {
        fs.unlinkSync(imagePath);
      }

      const output = await sharp(sourceImage)
        .resize(desiredSize.width, desiredSize.height, {
          position: desiredSize.crop || 'centre',
        })
        .toFile(imagePath);

      return {
        ...desiredSize,
        filename: imageNameWithDimensions,
        filesize: output.size,
        mimeType,
      };
    });

  const savedSizes = await Promise.all(sizes);

  return savedSizes.reduce((results, size) => ({
    ...results,
    [size.name]: {
      width: size.width,
      height: size.height,
      filename: size.filename,
      mimeType: size.mimeType,
      filesize: size.filesize,
    },
  }), {});
};
