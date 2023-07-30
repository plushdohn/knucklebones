import { defineStore } from "pinia";

type State = {
  static: {
    playerBoard: (number | null)[][];
    cpuBoard: (number | null)[][];
  };
  dynamic:
    | {
        phase: "GAME_STARTING";
      }
    | {
        phase: "ROLLING_PLAYER_DIE";
      }
    | {
        phase: "PLACING_PLAYER_DIE";
        playerDie: number;
      }
    | {
        phase: "ROLLING_CPU_DIE";
      }
    | {
        phase: "PLACING_CPU_DIE";
        cpuDie: number;
      }
    | {
        phase: "GAME_OVER";
        winner: "PLAYER" | "CPU";
      };
};

export const useGameStore = defineStore("game", {
  state: () =>
    ({
      static: {
        playerBoard: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
        cpuBoard: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
      },
      dynamic: {
        phase: "GAME_STARTING",
      },
    } as State),
  getters: {
    isPlayerTurn: (state: State) => {
      return (
        state.dynamic.phase === "ROLLING_PLAYER_DIE" ||
        state.dynamic.phase === "PLACING_PLAYER_DIE"
      );
    },
    isCpuTurn: (state: State) => {
      return (
        state.dynamic.phase === "ROLLING_CPU_DIE" ||
        state.dynamic.phase === "PLACING_CPU_DIE"
      );
    },
    playerScore: (state: State) => {
      return getBoardScore(state.static.playerBoard);
    },
    cpuScore: (state: State) => {
      return getBoardScore(state.static.cpuBoard);
    },
    isAnyBoardFull: (state: State) => {
      return (
        state.static.playerBoard.every((col) =>
          col.every((cell) => cell !== null)
        ) ||
        state.static.cpuBoard.every((col) => col.every((cell) => cell !== null))
      );
    },
  },
  actions: {
    startGame() {
      this.static = {
        playerBoard: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
        cpuBoard: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
      };

      this.dynamic = {
        phase: "ROLLING_PLAYER_DIE",
      };

      setTimeout(() => {
        this.rollPlayerDie();
      }, 1500);
    },
    rollPlayerDie() {
      if (this.dynamic.phase !== "ROLLING_PLAYER_DIE") return;

      this.dynamic = {
        phase: "PLACING_PLAYER_DIE",
        playerDie: Math.floor(Math.random() * 6) + 1,
      };
    },
    placePlayerDie(column: number) {
      if (this.dynamic.phase !== "PLACING_PLAYER_DIE") return;

      const cell = this.static.playerBoard[column].findIndex(
        (cell) => cell === null
      );

      if (cell === -1) {
        return;
      }

      this.static.playerBoard[column][cell] = this.dynamic.playerDie;
      this.static.cpuBoard = getBoardWithoutDieOccurrencesInColumn(
        this.static.cpuBoard,
        column,
        this.dynamic.playerDie
      );

      if (this.isAnyBoardFull) {
        this.dynamic = {
          phase: "GAME_OVER",
          winner: this.playerScore > this.cpuScore ? "PLAYER" : "CPU",
        };

        return;
      }

      this.dynamic = {
        phase: "ROLLING_CPU_DIE",
      };

      setTimeout(() => {
        this.rollCpuDie();
      }, 1500);
    },
    rollCpuDie() {
      if (this.dynamic.phase !== "ROLLING_CPU_DIE") return;

      const die = Math.floor(Math.random() * 6) + 1;

      this.dynamic = {
        phase: "PLACING_CPU_DIE",
        cpuDie: die,
      };

      setTimeout(() => {
        const columnIndex = getBestColumn(
          this.static.cpuBoard,
          this.static.playerBoard,
          die
        );

        this.placeCpuDie(columnIndex);
      }, 1000);
    },
    placeCpuDie(column: number) {
      if (this.dynamic.phase !== "PLACING_CPU_DIE") return;

      const cell = this.static.cpuBoard[column].findIndex(
        (cell) => cell === null
      );

      if (cell === -1) {
        return;
      }

      this.static.cpuBoard[column][cell] = this.dynamic.cpuDie;
      this.static.playerBoard = getBoardWithoutDieOccurrencesInColumn(
        this.static.playerBoard,
        column,
        this.dynamic.cpuDie
      );

      if (this.isAnyBoardFull) {
        this.dynamic = {
          phase: "GAME_OVER",
          winner: this.playerScore > this.cpuScore ? "PLAYER" : "CPU",
        };

        return;
      }

      this.dynamic = {
        phase: "ROLLING_PLAYER_DIE",
      };

      setTimeout(() => {
        this.rollPlayerDie();
      }, 1500);
    },
  },
});

function getBoardWithoutDieOccurrencesInColumn(
  board: (number | null)[][],
  column: number,
  die: number
) {
  return board.map((col, colIndex) => {
    if (colIndex !== column) return col;

    return col.map((cell) => (cell === die ? null : cell));
  });
}

function getBoardScore(board: (number | null)[][]) {
  return board.reduce((acc, column) => {
    const colValue = column.reduce((colAcc: number, cell) => {
      if (cell === null) return colAcc;

      return colAcc + cell * column.filter((c) => c === cell).length;
    }, 0);

    return acc + colValue;
  }, 0);
}

function getBestColumn(
  board: (number | null)[][],
  enemyBoard: (number | null)[][],
  die: number
) {
  const availableColumnsIndexes = board
    .map((_, colIndex) => colIndex)
    .filter((colIndex) => board[colIndex].some((cell) => cell === null));

  const columnValues = availableColumnsIndexes.sort((colIndexA, colIndexB) => {
    const colValueA = getColumnValue(colIndexA, board, enemyBoard, die);
    const colValueB = getColumnValue(colIndexB, board, enemyBoard, die);

    return colValueB - colValueA;
  });

  return columnValues[0];
}

function getColumnValue(
  column: number,
  board: (number | null)[][],
  enemyBoard: (number | null)[][],
  die: number
) {
  const colValue = board[column].reduce((colAcc: number, cell) => {
    if (cell !== die) return colAcc;

    return colAcc + die * board[column].filter((c) => c === die).length;
  }, 0);

  const enemyColValue = enemyBoard[column].reduce((colAcc: number, cell) => {
    if (cell !== die) return colAcc;

    return colAcc + die * enemyBoard[column].filter((c) => c === die).length;
  }, 0);

  return colValue + enemyColValue;
}
