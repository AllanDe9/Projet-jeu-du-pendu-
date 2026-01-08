import { wordsList } from './wordsList.js';
import removeAccents from "./removeAccent.js";

const loadWords = async (min, max) => {
  try {
    let words = wordsList.filter(word => {
        const cleanWord = removeAccents(word);
        return cleanWord.length >= min && cleanWord.length <= max;
    });
    console.log(`${words.length} mots chargés depuis wordsList.js`);

    if (words.length === 0) {
      console.warn(`Aucun mot trouvé pour la difficulté`);
      return wordsList;
    }
    return words;
  } catch (error) {
    console.error('Erreur lors du chargement des mots:', error);
  }
};

export { loadWords };
