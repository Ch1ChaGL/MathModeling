'use strict';

const deepCopyMatrix = matrix => {
  return matrix.map(row => row.slice());
};

class EnablingElement {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }
}

const elem = new EnablingElement(1, 1);

let Matrix = [
  [1, 1, 0, 3, 1, 0, 8],
  [2, 3, 1, 0, 0, -1, 14],
  [0, 1, 2, 4, 0, 0, 9],
  [1, 2, 1, 2, 0, 0, 0],
];

const matrixTransformation = (enablingElement, matrix) => {
  const newMatrix = deepCopyMatrix(matrix);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      if (i === enablingElement.i || j === enablingElement.j) continue;

      const aij = matrix[i][j];
      const apq = matrix[enablingElement.i][enablingElement.j];
      const apj = matrix[enablingElement.i][j];
      const aiq = matrix[i][enablingElement.j];

      const newElement = aij - (apj * aiq) / apq;

      newMatrix[i][j] = newElement;
    }
  }

  for (let j = 0; j < newMatrix[enablingElement.i].length; j++) {
    newMatrix[enablingElement.i][j] /=
      matrix[enablingElement.i][enablingElement.j];
  }
  for (let i = 0; i < newMatrix.length; i++) {
    if (i === enablingElement.i) continue;
    newMatrix[i][enablingElement.j] = 0;
  }
  return newMatrix;
};

const getNextEnablingElement = matrix => {
  const newMatrix = deepCopyMatrix(matrix);
  const lastRow = newMatrix[newMatrix.length - 1];

  const answers = [];
  for (let j = 0; j < lastRow.length - 1; j++) {
    if (lastRow[j] <= 0) continue;
    else {
      let min = {
        value: Infinity,
        i: null,
        j: null,
        valueMultiplyC: Infinity,
      };
      for (let i = 0; i < newMatrix.length - 1; i++) {
        if (newMatrix[i][j] <= 0 || null) {
          newMatrix[i][j] = null;
          continue;
        }
        newMatrix[i][j] = newMatrix[i].at(-1) / newMatrix[i][j];
        if (newMatrix[i][j] < min.value) {
          min.value = newMatrix[i][j];
          min.i = i;
          min.j = j;
          min.valueMultiplyC = min.value * newMatrix.at(-1)[j];
        }
      }
      answers.push(min);
    }

    // Возвращаем найденный разрешающий элемент
    //return enablingElement;
  }
  // Используем reduce для нахождения максимального значения
  const maxAnswer = answers.reduce(
    (max, current) =>
      current.valueMultiplyC > max.valueMultiplyC ? current : max,
    answers[0],
  );

  return new EnablingElement(maxAnswer.i, maxAnswer.j);
};

const isDone = matrix => {
  const newMatrix = deepCopyMatrix(matrix);
  const lastrow = newMatrix.at(-1);
  let answer = true;
  for (let j = 0; j < matrix.at(-1).length - 1; j++) {
    if (lastrow[j] > 0) {
      answer = false;
      break;
    }
  }
  return answer;
};

const getAnswer = matrix => Math.abs(matrix.at(-1).at(-1));

while (!isDone(Matrix)) {
  const elem = getNextEnablingElement(Matrix);
  Matrix = matrixTransformation(elem, Matrix);
}

console.log(getAnswer(Matrix));
