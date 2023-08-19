const { z } = require("zod");

require("dotenv").config();
const danfo = require("danfojs-node");

const { Tool } = require("langchain/tools");
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const {
  ConversationSummaryBufferMemory,
  BufferMemory,
} = require("langchain/memory");
const {
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("langchain/prompts");
const {
  createStructuredOutputChainFromZod,
} = require("langchain/chains/openai_functions");

function getHmSectionName(gptSection) {
  const input = gptSection.toLowerCase();

  switch (input) {
    case "mens":
      return "Menswear";

    case "womens":
      return "Ladieswear";

    case "kids boys":
    case "kids girls":
      return "Baby/Children";

    case "sports":
      return "Sport";

    case "unisex":
      return "Divided";

    default:
      return "all";
  }
}

class TrendingItemFinderTool extends Tool {
  name = "TrendingItemSearch";
  description = `useful when you want to get a list of trending items from certain section and category of fashion/apparel items in the store.`;
  async _call(input) {
    const dfd = await danfo.readCSV("./data/products.csv");

    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-0613",
      temperature: 0,
      openAIApiKey: process.env.OPEN_AI_KEY,
    });

    const responseFormat = z.object({
      categories: z
        .array(z.string())
        .describe(
          `An array of the closest matching categories chosen from the provided categories list.`
        ),
      section: z
        .string()
        .describe(
          "The closest matching section chosen from the provided section list."
        ),
      color: z.string().describe("The color chosen the provided colors list."),
    });
    const prompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `
 You are given an input fashion category. You should choose the closest
 and appropriate matches for that input category from the given list of fashion categories.
       
 Keep your category choices gender appropriate. For instance, do not recommend
 categories generally associated with women when asked for "mens clothing".

 Similarly, also choose a section from the provided list of sections.

 Similarly, also choose a color from the given list of colors.

 List of fashion categories to choose from: "Vest top", "Bra", "Underwear Tights", "Socks", "Leggings/Tights", "Sweater", "Top", "Trousers", "Hair clip", "Umbrella", "Pyjama jumpsuit/playsuit", "Bodysuit", "Hair string", "Unknown", "Hoodie", "Sleep Bag", "Hair/alice band", "Belt", "Boots", "Bikini top", "Swimwear bottom", "Underwear bottom", "Swimsuit", "Skirt", "T-shirt", "Dress", "Hat/beanie", "Kids Underwear top", "Shorts", "Shirt", "Cap/peaked", "Pyjama set", "Sneakers", "Sunglasses", "Cardigan", "Gloves", "Earring", "Bag", "Blazer", "Other shoe", "Jumpsuit/Playsuit", "Sandals", "Jacket", "Costumes", "Robe", "Scarf", "Coat", "Other accessories", "Polo shirt", "Slippers", "Night gown", "Alice band", "Straw hat", "Hat/brim", "Tailored Waistcoat", "Necklace", "Ballerinas", "Tie", "Pyjama bottom", "Felt hat", "Bracelet", "Blouse", "Outdoor overall", "Watch", "Underwear body", "Beanie", "Giftbox", "Sleeping sack", "Dungarees", "Outdoor trousers", "Wallet", "Swimwear set", "Swimwear top", "Flat shoe", "Garment Set", "Ring", "Waterbottle", "Wedge", "Long John", "Outdoor Waistcoat", "Pumps", "Flip flop", "Braces", "Bootie", "Fine cosmetics", "Heeled sandals", "Nipple covers", "Chem. cosmetics", "Soft Toys", "Hair ties", "Underwear corset", "Bra extender", "Underdress", "Underwear set", "Sarong", "Leg warmers", "Blanket", "Hairband", "Tote bag", "Weekend/Gym bag", "Cushion", "Backpack", "Earrings", "Bucket hat", "Flat shoes", "Heels", "Cap", "Shoulder bag", "Side table", "Accessories set", "Headband", "Baby Bib", "Keychain", "Dog Wear", "Washing bag", "Sewing kit", "Cross-body bag", "Moccasins", "Towel", "Wood balls", "Zipper head", "Mobile case", "Pre-walkers", "Toy", "Marker pen", "Bumbag", "Dog wear", "Eyeglasses", "Wireless earphone case", "Stain remover spray", "Clothing mist".

 List of sections to choose from: "Mens", "Womens", "Kids boys", "Kids girls", "Sports", "Unisex".

 List of colors to choose from: "Brown","Blue","Grey","Bluish Green","Red","Beige","Pink","Green","Metal","Black","White","Turquoise","Khaki green","Mole","Yellowish Green","Orange","Lilac Purple","Yellow"
 `
      ),
      HumanMessagePromptTemplate.fromTemplate("{inputText}"),
    ]);

    console.log("IN CAT IDENTIFYER. INPUT::::: ", input);

    const memory = new ConversationSummaryBufferMemory({
      llm: new ChatOpenAI({
        modelName: "gpt-3.5-turbo-0613",
        temperature: 0,
        openAIApiKey: process.env.OPEN_AI_KEY,
      }),
      memoryKey: "chat_history",
      returnMessages: true,
    });

    const chain = createStructuredOutputChainFromZod(responseFormat, {
      prompt: prompt,
      // verbose: true,
      llm,
      memory,
    });

    const response = await chain.call({
      inputText: `Input category: ${input}`,
    });

    console.log("CAT RESPONES:::::::::: ", response);

    const sectionName = getHmSectionName(response.output.section);
    const colorName = response.output.color;

    let mask;

    mask = dfd["product_type_name"].map((type) =>
      response.output.categories.includes(type)
    );

    if (sectionName !== "all") {
      mask = mask.and(
        dfd["index_group_name"].map((section) => sectionName === section)
      );
    }

    if (
      colorName &&
      colorName.length > 1 &&
      [
        "Brown",
        "Blue",
        "Grey",
        "Bluish Green",
        "Red",
        "Beige",
        "Pink",
        "Green",
        "Metal",
        "Black",
        "White",
        "Turquoise",
        "Khaki green",
        "Mole",
        "Yellowish Green",
        "Orange",
        "Lilac Purple",
        "Yellow",
      ].includes(colorName)
    ) {
      mask = mask.and(
        dfd["perceived_colour_master_name"].map(
          (color) => colorName.toLowerCase() === color.toLowerCase()
        )
      );
    }
    // for (const type of types) {
    //   mask.push(request.output.categories.includes(type));
    // }

    const requestedProducts = dfd.query(mask);

    requestedProducts.sortValues("trend_score", {
      ascending: false,
      inplace: true,
    });

    // danfo.toCSV(requestedProducts, { filePath: "./out.csv" });
    requestedProducts.resetIndex({ inplace: true });
    // requestedProducts.print();
    const sortedProductIds = requestedProducts["product_code"].dropDuplicates();
    // console.log(sortedProductIds.$index);
    const topProductIndices = [];
    let counter = 0;
    for (const i of sortedProductIds.$index) {
      topProductIndices.push(i);
      counter += 1;

      if (counter === 5) break;
    }

    // console.log(topProductIndices);
    const chosenProducts = requestedProducts.iloc({ rows: topProductIndices });
    const chosenProductsJson = danfo.toJSON(chosenProducts);

    return JSON.stringify(
      chosenProductsJson.map((product) => {
        return {
          product_name: product.prod_name,
          color: product.colour_group_name,
          description: product.detail_desc,
          image: `https://storage.googleapis.com/grid-store-items/images/0${product.article_id}.jpg`,
        };
      })
    );
  }
}

exports.TrendingItemFinderTool = TrendingItemFinderTool;
