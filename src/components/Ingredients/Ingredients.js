import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModule from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // useEffect(() => {
  //   fetch('https://react-hooks-cb589.firebaseio.com/ingredients.json')
  //     .then(
  //       response => {
  //         return response.json()
  //       }).then(responseData => {
  //         const loadedIngredients = [];
  //         for (const key in responseData) {
  //           loadedIngredients.push({
  //             id: key,
  //             title: responseData[key].title,
  //             amount: responseData[key].amount
  //           });
  //         }
  //         setUserIngredients(loadedIngredients);
  //       });
  // },[]);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('https://react-hooks-cb589.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then (response => {
      setIsLoading(false);
      return response.json();
    }).then (responseData => {
      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        {id: responseData.name, ...ingredient}
      ]);
    });
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch(`https://react-hooks-cb589.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: 'DELETE'
      }
    ).then(response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    }).catch(error => {
      setError('Removing ingredient: Something went wrong');
      setIsLoading(false);
    }

    );
  }

  const clearError = () => {
    setError(null);
  }
  
  return (
    <div className="App">
      {error && <ErrorModule onClose= {clearError}>{error}</ErrorModule>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />
      
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
