import { wordsList } from './wordsList.js';

let words = [];

const loadWords = async () => {
  try {
    words = [...wordsList];
    console.log(`${words.length} mots chargés depuis wordsList.js`);
  } catch (error) {
    console.error('Erreur lors du chargement des mots:', error);
  }
};

export { words, loadWords };
