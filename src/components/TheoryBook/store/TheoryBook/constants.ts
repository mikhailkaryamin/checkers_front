import boardSrc from '../../images/board.jpg';
import draughtsSrc from '../../images/draughts.jpg';
import piecesSrc from '../../images/pieces.jpg';
import russianShashkiSrc from '../../images/russian-shashki.jpeg';

export const bookData = [
  {
    image: boardSrc,
    text: `Шашки - логическая настольная игра для двух игроков, заключающаяся в передвижении определённым образом фишек-шашек по клеткам шашечной доски. Во время партии каждому игроку принадлежат шашки одного цвета: чёрного или белого. Цель игры — взять все шашки соперника или лишить их возможности хода. Существует несколько вариантов шашек, различающихся правилами и размерами игрового поля.`
  },
  {
    image: piecesSrc,
    text: `Основные правила игры, которые действуют во всех вариантах шашек:
    - Все шашки, участвующие в партии, выставляются перед началом игры на доску.
    - Брать шашку, находящуюся под боем, обязательно.
    - Существует только два вида шашек: простые и дамки. В начале партии все шашки простые.
    - Простые шашки ходят только вперёд на следующее поле. Дамки могут ходить и вперёд, и назад.`
  },
  {
    image: draughtsSrc,
    text: `Английские шашки.
    Первый ход делают чёрные шашки. «Простые» шашки могут ходить по диагонали на одно поле вперёд и бить только вперёд. Дамка может ходить на одно поле по диагонали вперёд или назад, при взятии ходит только через одно поле в любую сторону, а не на любое поле диагонали, как в русских или международных шашках. Взятие шашки соперника является обязательным.`
  },
  {
    image: russianShashkiSrc,
    text: `Русские шашки.
    Отличительные особенности:
    - Шашки ходят только вперёд по клеткам тёмного цвета.
    - Доска расположена так, чтобы угловое поле внизу слева со стороны игрока было тёмным.
    - Простая шашка бьёт вперёд и назад, "перепрыгивая" через шашку соперника на следующее поле.
    - Дамка ходит вперёд и назад на любое поле той диагонали, на которой она стоит.
    `
  },
  {
    image: russianShashkiSrc,
    text: `- Дамка бьёт вперёд и назад, и становится на диагональ на любое свободное поле за побитой шашкой.
    - Во время боя простая шашка может превратиться в дамку и сразу продолжить бой по правилам дамки.
    - При наличии нескольких вариантов боя можно выбрать любой из них.`
  },
]
