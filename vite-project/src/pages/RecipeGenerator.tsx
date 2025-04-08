import { useState } from "react";
import Together from "together-ai";
import MarkdownPreview from "@uiw/react-markdown-preview";

const App = () => {
  // State hooks
  const [res, setResponse] = useState<string>('');
  const [recipeName, setRecipeName] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('Italian'); // Default to Italian cuisine
  const [servings, setServings] = useState<number>(2); // Default 2 servings
  const [diet, setDiet] = useState<string>('None'); // Default no dietary preference
  const [cookingTime, setCookingTime] = useState<number>(30); // Default 30 minutes
  const [spiceLevel, setSpiceLevel] = useState<string>('Medium'); // Default to Medium spice level
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Together AI API setup
  const together = new Together({
    apiKey: '1b3f0fe8b0f211ae223861062626d5c523a08c77b9203adee483e409bd3f4f67'
  });

  // Function to call Together AI
  async function generateRecipe() {
    // Input validation
    if (!recipeName.trim() || !cuisine.trim()) {
      setError("Please provide both a recipe name and cuisine type.");
      return;
    }
    setError("");
    setLoading(true);
    setResponse("");

    try {
      const response: any = await together.chat.completions.create({
        messages: [
          {
            "role": "assistant",
            "content": `
            Instruction: You are an expert chef and recipe creator. Your task is to generate a detailed and visually appealing recipe for the user based on the provided inputs. Include:
            - **Ingredients**: Use bullet points with emojis for clarity (e.g., 🥦 for broccoli).
            - **Steps**: Format steps as a numbered list with emojis indicating actions (e.g., 🥄 for mixing, 🔥 for heating).
            - **Tips**: Highlight tips at the end in a box with 💡 for emphasis.
            - Use **Markdown formatting** to structure the response (headers, bold text, etc.).
            - Include creative emojis to make the recipe visually engaging. 
            If input is invalid or missing, respond with "❌ **Please provide valid inputs.**"
            `
          },
          {
            "role": "user",
            "content": `
            <recipe_name>
            ${recipeName}
            </recipe_name>
        
            <cuisine_type>
            ${cuisine}
            </cuisine_type>
        
            <servings>
            ${servings}
            </servings>
        
            <dietary_preference>
            ${diet}
            </dietary_preference>
        
            <cooking_time>
            ${cookingTime}
            </cooking_time>
        
            <spice_level>
            ${spiceLevel}
            </spice_level>
            `
          }
        ]
        ,
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 50,
        repetition_penalty: 1.1,
        stream: false
      });

      setResponse(response.choices[0]?.message?.content || "Something went wrong. Please try again.");
    } catch (err) {
      setError("Error fetching recipe. Please try again later.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-screen-md mx-auto bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        AI Recipe Generator 🍳
      </h1>

      {/* Recipe Name Input */}
      <textarea
        title="Recipe Name"
        placeholder="Enter the name of Ingredients (e.g., Potato, Rice, Flour)..."
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
      />

      {/* Cuisine Type Dropdown */}
      <div className="mb-4">
        <label htmlFor="cuisine" className="block text-lg font-medium mb-2">
          Select Cuisine Type:
        </label>
        <select
          id="cuisine"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm bg-white"
        >
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
          <option value="Indian">Indian</option>
          <option value="Mexican">Mexican</option>
          <option value="French">French</option>
          <option value="Japanese">Japanese</option>
          <option value="Thai">Thai</option>
          <option value="Greek">Greek</option>
        </select>
      </div>

      {/* Number of Servings */}
      <div className="mb-4">
        <label htmlFor="servings" className="block text-lg font-medium mb-2">
          Number of Servings:
        </label>
        <input
          type="number"
          id="servings"
          value={servings}
          onChange={(e) => setServings(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
          min={1}
        />
      </div>

      {/* Dietary Preferences */}
      <div className="mb-4">
        <label htmlFor="diet" className="block text-lg font-medium mb-2">
          Dietary Preference:
        </label>
        <select
          id="diet"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm bg-white"
        >
          <option value="None">None</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Keto">Keto</option>
        </select>
      </div>

      {/* Cooking Time */}
      <div className="mb-4">
        <label htmlFor="cookingTime" className="block text-lg font-medium mb-2">
          Cooking Time (in minutes):
        </label>
        <input
          type="number"
          id="cookingTime"
          value={cookingTime}
          onChange={(e) => setCookingTime(Number(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
          min={1}
        />
      </div>

      {/* Spice Level */}
      <div className="mb-4">
        <label htmlFor="spiceLevel" className="block text-lg font-medium mb-2">
          Spice Level:
        </label>
        <select
          id="spiceLevel"
          value={spiceLevel}
          onChange={(e) => setSpiceLevel(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none shadow-sm bg-white"
        >
          <option value="Mild">Mild</option>
          <option value="Medium">Medium</option>
          <option value="Hot">Hot</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={generateRecipe}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-md transition-all disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Response Display */}
      {!loading && res && (
        <div data-color-mode="light" className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Generated Recipe</h2>
          <MarkdownPreview
            source={res}
            style={{ padding: 24, maxWidth: '95vw', borderRadius: '12px' }}
          />
        </div>
      )}
    </div>
  );
};

export default App;