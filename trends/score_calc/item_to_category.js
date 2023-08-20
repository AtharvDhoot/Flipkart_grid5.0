function getDatasetCategoriesFromItemName(itemName) {
  const mapping = {
    Shoe: [
      "Flat shoe",
      "Boots",
      "Sandals",
      "Flip flop",
      "Heeled sandals",
      "Slippers",
      "Pumps",
    ],
    Sandal: ["Sandals"],
    Bracelet: ["Bracelet"],
    Earrings: ["Earring", "Earrings"],
    Clothing: ["T-shirt"],
    Top: ["Top", "Blouse", "Polo shirt"],
    Shorts: ["Shorts"],
    Sunglasses: ["Sunglasses"],
    Glasses: ["Eyeglasses"],
    Dress: ["Dress"],
    Skirt: ["Skirt"],
    Bag: ["Backpack", "Bag", "Cross-body bag", "Tote bag", "Weekend/Gym bag"],
    Pants: ["Trousers", "Leggings/Tights"],
    Outerwear: [
      "Sweater",
      "Jacket",
      "Coat",
      "Outdoor overall",
      "Cardigan",
      "Outerwear",
    ],
    "Sun hat": ["Bucket hat", "Sun hat", "Straw hat", "Hat/brim"],
    Coat: ["Coat"],
    Footwear: [
      "Flat shoe",
      "Boots",
      "Sandals",
      "Flip flop",
      "Heeled sandals",
      "Slippers",
      "Pumps",
    ],
    Hat: [
      "Hat/beanie",
      "Bucket hat",
      "Cap/peaked",
      "Straw hat",
      "Hat/brim",
      "Cap",
    ],
    Miniskirt: ["Skirt"],
    Overall: ["Dungarees", "Jumpsuit/Playsuit", "Overall", "Outdoor overall"],
    Necklace: ["Necklace"],
    Handbag: [
      "Bag",
      "Cross-body bag",
      "Tote bag",
      "Weekend/Gym bag",
      "Handbag",
    ],
    Brassiere: ["Bra"],
    Scarf: ["Scarf"],
    Swimwear: ["Swimsuit", "Swimwear set", "Swimwear bottom", "Swimwear top"],
    Belt: ["Belt"],
    Jeans: ["Trousers", "Jeans"],
    Shirt: ["Shirt", "Blouse", "Polo shirt"],
    "High heels": ["Heeled sandals", "Pumps", "Heels"],
    Bowtie: ["Tie"],
  };

  if (mapping[itemName])
    return `category="${mapping[itemName].join('" OR category="')}"`;

  return null;
}

// Example usage:
// const inputList = [
//   "Shoe",
//   "Sandal",
//   "Bracelet" /* ... add more items here ... */,
// ];

// const mappedItems = generateMapping(inputList);
// console.log(mappedItems);

// console.log(getDatasetCategoriesFromItemName("Top"));
exports.getDatasetCategoriesFromItemName = getDatasetCategoriesFromItemName;
