const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const SPOONACULAR_API_KEY = '8a724db9fe814978bc0bbdb1a9e4b611';

app.post('/recommend-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;

    // Call Spoonacular API to search for recipes based on ingredients
    const recipes = await searchRecipesByIngredients(ingredients);

    res.json({ recipes });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while recommending recipes.' });
  }
});

const searchRecipesByIngredients = async (ingredients) => {
  try {
    const response = await axios.get(
      'https://api.spoonacular.com/recipes/findByIngredients',
      {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          ingredients: ingredients.join(','),
          number: 10, // Specify the number of recipes you want to retrieve
        },
      }
    );

    // Process the response data and extract relevant recipe information
    const recipes = response.data.map((recipe) => {
      const ingredientsHave = recipe.usedIngredients.map((ingredient) => ingredient.originalString);

      return {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.image,
        ingredients: recipe.usedIngredients.concat(recipe.missedIngredients),
        ingredientsHave: ingredientsHave,
      };
    });

    return recipes;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw new Error('An error occurred while fetching recipes.');
  }
};

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
