import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import GroceryForm from './GroceryForm';
import GroceryListItem from './GroceryListItem';
import GroceryStore from './GroceryStore';
import InstructionsButton from '../InstructionsButton';

function GroceryList({ userInfo, setUserInfo }) {
  const [alteredGroceryList, setAlteredGroceryList] = useState([]);

  const groceryListSet = new Set(userInfo.groceryList);
  const groceryListArray = Array.from(groceryListSet);

  function setGroceryList(newList) {
    const groceryListProp = [];

    const arrayNames = userInfo.groceryList.map((ing) => ing?.name);

    newList.forEach((item) => {
      if (arrayNames.includes(item) || item === null) {
        return;
      }
      if (item?.shopped === undefined) {
        const temp = {};
        temp.name = item;
        temp.shopped = false;
        groceryListProp.push(temp);
      } else {
        groceryListProp.push(item);
      }
    });
    setAlteredGroceryList(groceryListProp);
  }

  useEffect(() => {
    setGroceryList(groceryListArray);
  }, [userInfo]);

  function updateUserInfo(name) {
    const tempList = [];

    alteredGroceryList.forEach((item) => {
      const tempObj = {};
      if (item.name === name) {
        tempObj.name = item.name;
        tempObj.shopped = !item.shopped;
      } else {
        tempObj.name = item.name;
        tempObj.shopped = item.shopped;
      }
      tempList.push(tempObj);
    });

    const axiosObj = { grocery: tempList, userId: userInfo.userId };
    axios
      .put('/grocery', axiosObj)
      .then((res) => setAlteredGroceryList(res.data.groceryList))
      .catch((err) => console.log(err));

    const pantryArray = userInfo.pantry ? Object.keys(userInfo.pantry) : [];
    if (!pantryArray.includes(name)) {
      const additionalPantryItem = name;
      const newPantryItem = userInfo.pantry ? { ...userInfo.pantry } : {};
      newPantryItem[additionalPantryItem] = { q: '', c: '', e: '' };
      axios
        .put('/pantry', { pantry: newPantryItem, userId: userInfo.userId })
        .then((res) => setUserInfo(res.data))
        .catch((err) => console.log(err));
    } else {
      const additionalPantryItem = name;
      const newPantryItem = { ...userInfo.pantry };
      delete newPantryItem[additionalPantryItem];
      axios
        .put('/pantry', { pantry: newPantryItem, userId: userInfo.userId })
        .then((res) => setUserInfo(res.data))
        .catch((err) => console.log(err));
    }
  }

  function removeFromList(name, event) {
    event.preventDefault();
    const tempList = [];

    alteredGroceryList.forEach((item) => {
      if (item.name !== name) {
        tempList.push(item);
      }
    });

    const axiosObj = { grocery: tempList, userId: userInfo.userId };
    axios
      .put('/grocery', axiosObj)
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.log(err));
  }

  function clearFullList(event) {
    event.preventDefault();
    const tempList = [];

    const axiosObj = { grocery: tempList, userId: userInfo.userId };
    axios
      .put('/grocery', axiosObj)
      .then((res) => setUserInfo(res.data))
      .catch((err) => console.log(err));
  }

  return (
    <Page>
      <Left>
        <Title> Here is your grocery list.</Title>
        <GroceryListCont>
          {userInfo.groceryList &&
            alteredGroceryList.map((ingredient) => (
              <GroceryListItem
                removeFromList={removeFromList}
                updateUserInfo={updateUserInfo}
                pantry={userInfo.pantry}
                ingredient={ingredient}
                key={ingredient.name}
              />
            ))}
        </GroceryListCont>
        <button onClick={clearFullList} type="submit">
          Clear List
        </button>
        <InstructionsButton text="example instructions on how to use things" />
      </Left>
      <Right>
        <AddForm>
          <GroceryForm
            setAlteredGroceryList={setAlteredGroceryList}
            userInfo={userInfo}
            alteredGroceryList={alteredGroceryList}
            setUserInfo={setUserInfo}
          />
          <MapDiv>
            <GroceryStore />
          </MapDiv>
        </AddForm>
      </Right>
    </Page>
  );
}

export default GroceryList;

// const Page = styled.div`
//   max-width: 900px;
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   align-items: flex-start;
//   justify-content: space-around;
// `;

const GroceryListCont = styled.div`
  width: 100%;
`;

const Left = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`

const Right = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const AddForm = styled.div`

`;

const MapDiv = styled.div`
  width: 60vw;
`;

const Page = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-evenly;
`;

const Top = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.p`
  font-size: 20px;
  margin: 0;
`