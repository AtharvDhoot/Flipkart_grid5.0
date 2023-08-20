const vision = require("@google-cloud/vision");
const { Image } = require("image-js");

const { InstaScraper } = require("../scraper/insta_scraper");
const { readObjectFromFile } = require("../utils");

class ObjectExtractor {
  _fashionObjects = readObjectFromFile(
    "./object_extractor/FASHION_OBJECTS.json"
  );
  async init() {
    const _instaScraper = new InstaScraper();
    // this._socialImgBuffers = await _instaScraper.getTredingImagesBuffers();
    this._socialImgUris = await _instaScraper.getTredingImagesUris();
    this._client = new vision.ImageAnnotatorClient();
  }

  // async saveFashionObjects() {
  //   let localizedObjects = [];

  //   for (const buffer of this._socialImgBuffers) {
  //     const request = {
  //       image: { content: buffer },
  //     };

  //     const [result] = await this._client.objectLocalization(request);
  //     const objects = result.localizedObjectAnnotations;

  //     const filteredObjects = objects.filter(
  //       (object) =>
  //         object.score > 0.65 && this._fashionObjects.includes(object.name)
  //     );

  //     localizedObjects.push(filteredObjects);
  //     //   console.log(JSON.stringify(filteredObjects, null, 2));
  //   }

  //   for (let i = 0; i < this._socialImgBuffers.length; i++) {
  //     const buffer = this._socialImgBuffers[i];
  //     const objects = localizedObjects[i];

  //     const image = await Image.load(buffer);
  //     const w = image.width;
  //     const h = image.height;

  //     for (const object of objects) {
  //       const vertices = object.boundingPoly.normalizedVertices;

  //       const cropX = vertices[0].x * w;
  //       const cropY = vertices[0].y * h;

  //       const cropW = (vertices[1].x - vertices[0].x) * w;
  //       const cropH = (vertices[2].y - vertices[1].y) * h;

  //       const croppedImg = image.crop({
  //         x: cropX,
  //         y: cropY,
  //         width: cropW,
  //         height: cropH,
  //       });

  //       await croppedImg.save(`./objs/${i}_${object.name}.jpg`);
  //     }
  //   }
  // }

  async getLocalisedObjects() {
    let localizedObjects = [];

    for (const uri of this._socialImgUris) {
      const request = {
        image: {
          source: {
            imageUri: uri,
          },
        },
      };

      const [result] = await this._client.objectLocalization(request);
      const objects = result.localizedObjectAnnotations;

      const filteredObjects = objects.filter(
        (object) =>
          object.score > 0.65 && this._fashionObjects.includes(object.name)
      );

      filteredObjects.uri = uri;
      localizedObjects.push(filteredObjects);
    }

    return localizedObjects;
  }
}

async function main() {
  const extractor = new ObjectExtractor();

  await extractor.init();

  console.log(JSON.stringify(await extractor.getLocalisedObjects(), null, 2));
}

// main();
exports.ObjectExtractor = ObjectExtractor;
