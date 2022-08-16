/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import styled from 'styled-components';

function GroceryListItem({
  removeFromList,
  updateUserInfo,
  ingredient,
  pantry,
}) {
  const [tempIng, setTempIng] = useState(ingredient);
  const [flag, setFlag] = useState(true);

  const pantryArray = pantry ? Object.keys(pantry) : [];

  function toggleStriked() {
    updateUserInfo(ingredient.name);
  }

  if (pantryArray.includes(ingredient.name) && flag) {
    setTempIng({ ...tempIng, stateShopped: true });
    setFlag(false);
  }

  return (
    <div>
      {!tempIng.stateShopped ? (
        <span
          onClick={() => {
            toggleStriked();
            setTempIng({ ...tempIng, stateShopped: true });
          }}
          onKeyPress={() => toggleStriked()}
        >
          {ingredient.name}
        </span>
      ) : (
        <span>
          <strike
            onClick={() => {
              setTempIng({ ...tempIng, stateShopped: false });
              toggleStriked();
            }}
            onKeyPress={() => toggleStriked()}
          >
            {ingredient.name}
          </strike>
        </span>
      )}
      <button
        onClick={(event) => removeFromList(ingredient.name, event)}
        type="submit"
      >
        X
      </button>
    </div>
  );
}

export default GroceryListItem;
