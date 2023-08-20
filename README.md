# Fashion Recommender AI Assistant

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

The goal of this system is to recommend products based on user past purchase history. This is the most valuable data to us since it describes the user fashion sense and what they actually like.

### What data to use?
We used the same [H&M Personalized Fashion Recommendations](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/data) competition dataset, which consists of previous transactions, as well as customer and product data. The dataset has comprehensive list of 105k articles consisting of all the fashion items. It also has data of about 137k customers and data of around 30 million transactions. 

### Recommendation Algorithim
We used an open-source model for [this](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations/discussion/324076/) which is a light-weight candidate retrieval method.

#### Preprocessing the dataset
We used cudf to process the data faster. We got week number and week day of all the transactions data. The data was recorded from 2018 to 2020.

Then we created pairs of articles that are commonly bought together by customers. This was done for only the latest 9 weeks and for each week we find 5 "pairs" for each article.

#### Retrieval/Features function
Then a function generates and enhances candidate sets for modeling tasks. It creates candidates based on customer behavior, filters and adds features, incorporates article-related information, and handles feature selection, ultimately producing a dataframe of candidates with associated features. Feature engineering was done for the following features:

##### Article-Related Features
- Maximum price
- Last week's price ratio

##### Customer-Related Features
- Average max price
- Average last week's price
- Average price ratio
- Average sales channel
- Transaction counts
- Unique transaction counts
- Gender representation based on article categories

##### Article-Related Transaction Features
- Average sales channel
- Transaction counts
- Unique customer counts

##### Article-Specific Customer Age Features
- Average customer age for each article

##### Lag-Based Features
- Count of unique customers for each article within specified lag days

##### Rebuy-Related Features
- Rebuy count ratio (average count of rebuys)
- Rebuy ratio (proportion of articles rebought)

#### Scoring the model
Next we created a function which generates predictions for top 12 articles for each customer and compares to ground truth. We used LightGBM Ranker model to train of the whole dataset. It was chosen for recommendation tasks due to its specialization in ranking items for users, direct optimization for ranking metrics like Mean Average Precision (MAP), and efficiency in handling large datasets. It captures personalized preferences and offers efficient, customizable ranking solutions for recommendation systems.

Features to feed to LGBMRanker:

- The strength of the "match" (i.e. how many/what percentage of customers the "pair" was based on)
- The "source" of the pair (i.e. how recently the original article was purchased, how many times it was purchased)

#### Results
The model took around 20 mins to run fully on Kaggle provided Nvidia P100 GPU, giving us:
- Train AUC 0.7604
- Train score: 0.06767
- MAP@12: 0.02884

It was calcualted like this:

![Map@12](images\map12.png)

It is a sort of manual, time-aware collaborative filtering method - what customers with similar purchase interests were purchased in the past week - so it includes trend information as well.

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