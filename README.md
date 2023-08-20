# Fashion Recommender AI Assistant

ideation:

- categorization of problem statement into sub problems
  - Trendiness calculator
  - personalised recommendation system
  - Combining prev systems
  - making a conversational system integrated with other systems
- a description of each sub problem
  - Goal(s) for that sub-problem
  - Pre-req research for each sub-problem
  - how we achieved the goals, basically our process for solving it
    - Higher level overview
    - Technical parts explanation (if required)

outline:

- Things to know before reading ahead
  - h&m data set is our supposed "store"

- categorization of problem statement into sub problems (just mention the headlines)
  - Trendiness calculator
  - personalised recommendation system
  - conversational system

[Detailed description of the following sub-problems]

- Trendiness calculator
  - how to choose what to scrape
  - The algorithm from scraping to trend_scores
- personalised recommendation system

Combining prev systems

Making a conversational system

## Introduction

**Problem Statement**: Conversational Fashion Outfit Generator powered by GenAI

This is a great problem statement because of its immense width. We broke it down into sub-modules to work on one at a time and put them together later. We divided it into the following three sub-projects:

- Current trends calculator
- Personalized recommendation system
- GPT integration

We have given an overview of each of them below, along with our some datasets used.

## Apparel Store Data

We used the products in [H&M Personalized Fashion Recommendations Dataset](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/data) as if they are the products availaible in our store.

## Current Trends Calculator

### Obtaining Social Media Data

Before even defining the notion of "trendiness" we knew we had to scrape fashion images from social media. We started with Instagram as online research indicated that Instagram is where most people go for their fashion needs.

We first looked up Meta's official Instagram APIs but using them for live data required submission of a completed app for a manual approval process by Meta. This made it a no go for this proof-of-concept because of the time constraints.

Then we considered scraping the web version of Instagram. We knew that Instagram is good at detecting scrapers and banning their IP addresses and/or accounts, but we wanted to try our hand at it anyways with the hope we might avoid the ban for long enough to get some meaningful data. So we created a new account, ran some scraping code and were banned within the first thirty minutes of experimenting with the scraping library.

We found out that running scraping accounts of different proxies will help with the situtation but we had neither the time, nor the financial resources to setup a multi-proxy scraping solution. So we found a company called [Lamdava](https://lamadava.com/), which has setup their proxy based scraping solution and allows access to it through an API.

Other sources of latest trends data, like Pintrest, fashion blogs etc. could also be fed into the system. However for this proof-of-concept we decided to stick with just Instagram as the source for our trends data.

### What to Scrape?

Now that we had the capability to obtain data from Instagram, we had to decide what exactly to scrape. We made a curated list of top fashion related hashtags, and top fashion influencers and decided to scrape images from them.

We scraped the current top 27 posts for each hashtag, and most recent 33 posts for each influencer. For video posts and reels in our results, we took the thumbnail image instead of the video file.

### Calculating Trendiness

We came up with the following algorithm for calculating trendiness of items in our store:

- Maintain a dictionary of a `trend_score` for each item in our store
- Detect individual objects in each of the scraped images, and crop and save detected fashion items (caps, clothes, earings, necklaces etc.)
- For each detected fashion item do the following:
  - Find items (say 5) similar to the detected item, in the store items dataset
  - For each such simiilar item found do `trend_score[similar_item_id] += similarity_score`
- Normalize the `trend_score` values for each category (tops, shoes, jeans, watches etc.) of items
- Repeat the above steps every `n` days/hours, depending on how frequent trends you want the system to reflect

We normalize the `trend_score` values as mentioned above because the trend scores for some category of items were shooting way up than those of items from other categories. This happened because some categories have much less items than others, and hence an item from such a category has a higher chance of showing up in the similarity search. For instance, if we have a 100 t-shirts in the store dataset, but only 10 shoes, and we find five items similar to each of (say) 10 t-shirts, and 10 shoes. Then each shoe in the dataset will come up much more than each t-shirt will, which will results in shoes having a much higher absolute `trend_score` than t-shirts.

### Object Detection and Image Similarity Search

We used the following services from Google Cloud's [Vision AI Platform](https://cloud.google.com/vision/):

- Object localization service: Used for detecting objects in images. We filtered out any fashion objects that were detected using this
- Vision product search: Used for searching for similar products. We fed this system cropped fashion objects which were generated using the output of the object localization service. This was utilized to get top 5 similar items in store dataset for each item in the scraped images

We used the output similarity score from the product search service to calculated trend score for each of the products in the dataset.

This was our first time using a major cloud platform, which helped us learn a lot about the various tools and services provided by them. Apart from the services mentioned above, we used storage buckets, compute engines, and learned about cloud cost management.

## Personalized Recommendation System

## GPT Integration

So we obvioiusly used OpenAI chat based GPT models. We tried both `gpt-3.5-turbo-0613` and `gpt-4-0613` but settled with `gpt-3.5-turbo-0613` because of its higher speed, and lower cost benefits.

We read up OpenAI's docs for tips on writing great prompts and using their models to call functions. Eventually we came up with the following solution:

- Have the AI chat with the user to identify what types of items the user is looking to purchase
- When the AI is done identifying what types of items the user is looking to purchase, it will call a function with that information as its arguments
- Another AI model in instantiated, in the backend, by that function. This new AI chooses the most appropriate filters based on the information provided to it by the user-facing AI model. These filters are given out by the AI as a JSON object with a schema that we defined.
- These filters are then used to query the store dataset for items.
- These filtered out items are then sorted in descending order based on their `purchasability` score.
- The top purchasable items among the filtered items (upto, say, 5) are then returned by the function, to the user-facing AI, which then displays them to the user.

`purchasability` of each item is calculated as follows:

- `purchasability[i] = trend_score[i] + (is_recommended_for_requesting_user[i] ? 1 : 0)`

### LangChain

Implementing all these interactions between multiple LLMs, having them call function which interact with the store data, and more is simplified a bit by using [LangChain](https://github.com/hwchase17/langchainjs). It is a library that assists in developing LLM based apps.