const fs = require("fs").promises;

require("dotenv").config();
const axios = require("axios");
const { Image } = require("image-js");

const { readObjectFromFile, writeObjectToFile } = require("../utils");

class InstaScraper {
  _hashtags = [
    "ootd",
    "wiwt",
    "fashion",
    "style",
    "instafashion",
    "streetstyle",
    "fashionblogger",
    "fashionista",
    "trendy",
    "newfashion",
    "sale",
    "fashionweek",
    "lookbook",
    "ootdshare",
    "fashiongram",
    "fashionistastyle",
    "fashionaddict",
    "fashionblogger",
    "streetstyle",
    "fashionnova",
    "highfashion",
    "luxuryfashion",
    "streetwear",
    "athleisure",
    "menswear",
    "mensfashion",
    "mensstyle",
    "mensstreetstyle",
    "mensootd",
    "mensfashionblogger",
    "mensfashionaddict",
    "mensfashiondaily",
    "mensfashiongram",
    "mensfashionista",
    "mensfashionworld",
    "menssuits",
    "mensboots",
    "menswatches",
    "mensaccessories",
    "menshairstyle",
    "mensgrooming",
    "mensfitness",
    "menstravel",
    "mensluxury",
    "mensvintage",
    "mensstreetwear",
  ];

  _influencer_usernames = [
    "juhigodambe",
    "komalpandeyofficial",
    "thatbohogirl",
    "aashnashroff",
    "santoshishetty",
    "akanksharedhu",
    "houseofmisu",
    "usaamahsiddique",
    "giasaysthat",
    "aakritiranaofficial",
    "masoomminawala",
    "theformaledit",
    "shauryasanadhya",
    "diipakhosla",
    "settlesubtle",
    "siddharth93batra",
    "stylemeupwithsakshi",
    "thecozyvibe",
    "shereenlovebug",
    "thechiquefactor",
    "plumptopretty",
    "nihaelety",
    "thezlist",
    "kompalmattakapoor",
    "sruthijayadevan",
    "jyo_shankar",
    "adityaseal",
    "anushkaranjan",
    "shirleysetia",
    "rohit_khandelwal77",
    "alexcosta",
    "teachingmensfashion",
    "brandonbalfourr",
    "imdanielsimmons",
    "fearofgod",
  ];

  _influencer_pks = {};

  _apiUrl = process.env.INSTA_API_URL; // Replace with the actual API URL
  _headers = {
    "x-access-key": `${process.env.INSTA_API_KEY}`,
  };

  _getHashtagImageUris = async () => {
    const uris = [];
    for (const hashtag of this._hashtags) {
      const response = await axios.get(
        `${this._apiUrl}/v1/hashtag/medias/top/chunk?name=${hashtag}`,
        { headers: this._headers }
      );

      const posts = response.data[0];

      for (const post of posts) {
        uris.push(this._extractUrlFromPost(post));
      }
    }
    return uris;
  };

  _getInfluencerImageUris = async () => {
    const uris = [];

    const influencers = await this._getInfluencers();

    for (const username of this._influencer_usernames) {
      const influencer = influencers[username];

      const response = await axios.get(
        `https://api.lamadava.com/v1/user/medias/chunk?user_id=${influencer.pk}`,
        { headers: this._headers }
      );

      const posts = response.data[0];

      for (const post of posts) {
        uris.push(this._extractUrlFromPost(post));
      }
    }

    return uris;
  };

  _getInfluencers = async () => {
    const PKS_FILE_PATH = "./json/influencers.json";

    let influencers = {};

    try {
      influencers = readObjectFromFile(PKS_FILE_PATH);
    } catch (_) {}

    // populate missing pks
    for (const username of this._influencer_usernames) {
      if (influencers[username]) continue;

      const response = await axios.get(
        `https://api.lamadava.com/v1/user/by/username?username=${username}`,
        { headers: this._headers }
      );

      influencers[username] = response.data;
    }

    writeObjectToFile(PKS_FILE_PATH, influencers);

    return influencers;
  };

  _extractUrlFromPost(post) {
    if (post.thumbnail_url) {
      return post.thumbnail_url;
    } else {
      return post.resources[0].thumbnail_url;
    }
  }

  async getTredingImagesBuffers() {
    const uris = await this.getTredingImagesUris();

    const responsePromises = uris.map((uri) => {
      return axios.get(uri, { responseType: "arraybuffer" });
    });

    const responses = await Promise.all(responsePromises);

    // console.log(responses);

    const buffers = responses.map((response) =>
      Buffer.from(response.data, "binary")
    );

    // let i = 336;
    // for (const buffer of buffers) {
    //   const image = await Image.load(buffer);
    //   await image.save(`./imgs/img_${i}.jpg`);

    //   i += 1;
    // }
    // console.log(uris.length);
    return buffers;
  }

  async getTredingImagesUris() {
    const hashtagUris = await this._getHashtagImageUris();

    const influencerUris = await this._getInfluencerImageUris();

    const uris = [...hashtagUris, ...influencerUris];

    writeObjectToFile("./uris.json", uris);
    // const uris = readObjectFromFile("./uris.json");
    // const uris = [
    //   // "https://scontent-bos5-1.cdninstagram.com/v/t51.2885-15/363882406_963843878183769_98740178721926159_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-bos5-1.cdninstagram.com&_nc_cat=109&_nc_ohc=DHekT1huz70AX_QumZq&edm=AMKDjl4BAAAA&ccb=7-5&ig_cache_key=MzE3MDE3OTI4NjE5MDM5OTkxMw%3D%3D.2-ccb7-5&oh=00_AfBExAAbKasWan-kg0mN5qk0jNUE5yKOn-pdm9ELO4tuZQ&oe=64E1B4E2&_nc_sid=472314",

    //   "https://scontent-bos5-1.cdninstagram.com/v/t51.2885-15/367869693_951747645918155_3661979939068660418_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-bos5-1.cdninstagram.com&_nc_cat=111&_nc_ohc=kSWpVcGW_lkAX9cx54H&edm=AMKDjl4BAAAA&ccb=7-5&ig_cache_key=MzE3MDE5NDIyMzE2NDg2MzI1OQ%3D%3D.2-ccb7-5&oh=00_AfCqRHEkMsfPKA5LYWKZ7F7HV85QDncyyQkZjN7dVdqltA&oe=64E12012&_nc_sid=472314",
    //   // "https://scontent-bos5-1.cdninstagram.com/v/t51.2885-15/367402454_236458388861064_8344987737439715906_n.jpg?stp=dst-jpg_e35&_nc_ht=scontent-bos5-1.cdninstagram.com&_nc_cat=100&_nc_ohc=toS1JCvGm4kAX9SxvEx&edm=AMKDjl4BAAAA&ccb=7-5&ig_cache_key=MzE3MDE1NTk2MTY2NzU2MDk5OQ%3D%3D.2-ccb7-5&oh=00_AfDSP09eXxt8lu7yA4h29wvCIE2aVqmY51AjriqdwGApGQ&oe=64E1E7AC&_nc_sid=472314",
    // ];

    return uris;
  }
}

async function main() {
  const scraper = new InstaScraper();

  console.log(await scraper.getTredingImagesBuffers());
}

// main();

exports.InstaScraper = InstaScraper;
