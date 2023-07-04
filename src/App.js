import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState([]);

  const handleChange = (e) => {
    setIngredients(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/recommend-recipes', { ingredients: ingredients.split(',') });
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Error:', error.response.data);
    }
  };

  return (
    <div>
      <h1>Recipe Recommendation App</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your available ingredients (comma-separated):
          <input type="text" value={ingredients} onChange={handleChange} />
        </label>
        <button type="submit">Get Recipes</button>
      </form>
      <h2>Recommended Recipes:</h2>
      <ul>
        {recipes.map((recipe, index) => (
          <li key={index}>
            <h3>{recipe.title}</h3>
            <img src={recipe.imageUrl} alt={recipe.title} />
            <p>Ingredients:</p>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  style={{ color: ingredient.name.includes(ingredients) ? 'green' : 'red' }}
                >
                  {ingredient.original}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
