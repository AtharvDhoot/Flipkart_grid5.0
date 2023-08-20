const vision = require("@google-cloud/vision");
const { Image } = require("image-js");

const { readObjectFromFile, writeObjectToFile } = require("../utils");
const { getDatasetCategoriesFromItemName } = require("./item_to_category");
const { ObjectExtractor } = require("../object_extractor/object_extractor");

class ScoreCalc {
  _IMGS_ALLOWED_PER_BATCH_PRODUCT_SEARCH_REQUEST = 16;

  async init() {
    this._extractor = new ObjectExtractor();
    await this._extractor.init();

    this._localisedObjects = await this._extractor.getLocalisedObjects();

    this._productSearchClient = new vision.ProductSearchClient();
    this._imageAnnotatorClient = new vision.ImageAnnotatorClient();
  }

  async asyncCalculateScores() {
    const projectId = "vivid-union-395910";
    const location = "asia-east1";
    const productSetId = "product_set_0";
    const productCategory = "apparel-v2";
    const productSetPath = this._productSearchClient.productSetPath(
      projectId,
      location,
      productSetId
    );

    const requests = [];
    for (const objects of this._localisedObjects) {
      const uri = objects.uri;

      for (const object of objects) {
        console.log(
          "FILTER EXPR: ",
          getDatasetCategoriesFromItemName(object.name)
        );

        requests.push({
          image: { source: { imageUri: uri } },
          features: [{ type: "PRODUCT_SEARCH", maxResults: 5 }],
          imageContext: {
            productSearchParams: {
              boundingPoly: object.boundingPoly,
              productSet: productSetPath,
              productCategories: [productCategory],
              filter: getDatasetCategoriesFromItemName(object.name),
            },
          },
        });
      }
    }
  }

  async calculateScores() {
    const projectId = "vivid-union-395910";
    const location = "asia-east1";
    const productSetId = "product_set_0";
    const productCategory = "apparel-v2";
    const productSetPath = this._productSearchClient.productSetPath(
      projectId,
      location,
      productSetId
    );

    const requests = [];
    for (const objects of this._localisedObjects) {
      const uri = objects.uri;

      for (const object of objects) {
        console.log(
          "FILTER EXPR: ",
          getDatasetCategoriesFromItemName(object.name)
        );

        requests.push({
          image: { source: { imageUri: uri } },
          features: [{ type: "PRODUCT_SEARCH", maxResults: 5 }],
          imageContext: {
            productSearchParams: {
              boundingPoly: object.boundingPoly,
              productSet: productSetPath,
              productCategories: [productCategory],
              filter: getDatasetCategoriesFromItemName(object.name),
            },
          },
        });
      }
    }

    let productScoreMap = {};

    let requestCount = 0;
    let requestsToSend = [];

    for (const request of requests) {
      requestsToSend.push(request);

      if (
        requestsToSend.length ==
        this._IMGS_ALLOWED_PER_BATCH_PRODUCT_SEARCH_REQUEST
      ) {
        const [response] = await this._imageAnnotatorClient.batchAnnotateImages(
          {
            requests: requestsToSend,
          }
        );

        writeObjectToFile(
          `./score_calc/result_${requestCount}.json`,
          response.responses
        );
        requestCount += 1;

        for (let i = 0; i < response.responses.length; i++) {
          const results = response.responses[i]?.productSearchResults?.results;

          if (!results) continue;

          for (const result of results) {
            const pNameSplit = result.product.name.split("/");
            const productId = pNameSplit[pNameSplit.length - 1];

            const refImgSplit = result.image.split("/");
            const articleId = refImgSplit[refImgSplit.length - 1];

            const score = result.score;

            if (!productScoreMap[productId]) {
              productScoreMap[productId] = 0;
            }

            productScoreMap[productId] += score;
          }
        }

        requestsToSend = [];
      }
    }

    console.log(productScoreMap);

    writeObjectToFile("./score_calc/product_score_map.json", productScoreMap);

    // console.log(JSON.stringify(response["responses"]));
  }
}

exports.ScoreCalc = ScoreCalc;
