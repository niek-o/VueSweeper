import {reactive, Ref, ref} from "vue";
import {CellType} from "./types";
import {getRandomNumber} from "./getRandomNumber";

let globalWidth = 0
let globalHeight = 0
let globalBombs = 0

export const flags: Ref<number> = ref(globalBombs)

export const gameOver: Ref<boolean> = ref(false)
export const win: Ref<boolean> = ref(false)

const moves: Ref<number> = ref(0)

export const grid: CellType[][] = reactive([])

const cellCount: Ref<number> = ref(globalWidth * globalHeight - globalBombs)

function shortDim(cell: CellType) {
    fakeDim(cell, true)
    setTimeout(() => {
        fakeDim(cell, false)
    }, 75)
}

function fakeDim(cell: CellType, dimmed: boolean) {
    const {r, l, br, b, bl, tr, t, tl} = getAdjacentTiles(cell)

    if (r && !r.flag) r.fakeDimmed = dimmed
    if (l && !l.flag) l.fakeDimmed = dimmed

    if (grid[cell.row + 1]) { // check bottom row
        if (br && !br.flag) br.fakeDimmed = dimmed
        if (b && !b.flag) b.fakeDimmed = dimmed
        if (bl && !bl.flag) bl.fakeDimmed = dimmed
    }

    if (grid[cell.row - 1]) { // check top row
        if (tr && !tr.flag) tr.fakeDimmed = dimmed
        if (t && !t.flag) t.fakeDimmed = dimmed
        if (tl && !tl.flag) tl.fakeDimmed = dimmed
    }
}

function checkAdjacentCells(cell: CellType) {
    const flagsNearCell = getAmountOfFlagsAdjacentToCell(cell)
    shortDim(cell)

    if (flagsNearCell === cell.val) {
        dimAdjacentTiles(cell)
    }
}

function getAdjacentTiles(cell: CellType) {
    const r = grid[cell.row][cell.col + 1]
    const l = grid[cell.row][cell.col - 1]

    let br, b, bl;

    if (grid[cell.row + 1]) {
        br = grid[cell.row + 1][cell.col + 1]
        b = grid[cell.row + 1][cell.col]
        bl = grid[cell.row + 1][cell.col - 1]
    }

    let tr, t, tl;

    if (grid[cell.row - 1]) {
        tr = grid[cell.row - 1][cell.col + 1]
        t = grid[cell.row - 1][cell.col]
        tl = grid[cell.row - 1][cell.col - 1]
    }

    return {r, l, br, b, bl, tr, t, tl}
}

function getAmountOfFlagsAdjacentToCell(cell: CellType) {
    let flagsNearCell = 0;

    const {r, l, br, b, bl, tr, t, tl} = getAdjacentTiles(cell)

    if (r && r.flag) flagsNearCell++
    if (l && l.flag) flagsNearCell++

    if (grid[cell.row + 1]) { // check bottom row
        if (br && br.flag) flagsNearCell++
        if (b && b.flag) flagsNearCell++
        if (bl && bl.flag) flagsNearCell++
    }

    if (grid[cell.row - 1]) { // check top row
        if (tr && tr.flag) flagsNearCell++
        if (t && t.flag) flagsNearCell++
        if (tl && tl.flag) flagsNearCell++
    }

    return flagsNearCell
}

function dimAdjacentTiles(cell: CellType) {
    const {r, l, br, b, bl, tr, t, tl} = getAdjacentTiles(cell)

    if (r && !r.dimmed) dimCell(r)
    if (l && !l.dimmed) dimCell(l)

    if (grid[cell.row + 1]) { // check bottom row
        if (br && !br.dimmed) dimCell(br)
        if (b && !b.dimmed) dimCell(b)
        if (bl && !bl.dimmed) dimCell(bl)
    }

    if (grid[cell.row - 1]) { // check top row
        if (tr && !tr.dimmed) dimCell(tr)
        if (t && !t.dimmed) dimCell(t)
        if (tl && !tl.dimmed) dimCell(tl)
    }
}

export function dimCell(cell: CellType) {
    if (moves.value === 0) {
        grid[cell.row][cell.col].bomb = true
        generateBombs(globalWidth, globalHeight, globalBombs)
        grid[cell.row][cell.col].bomb = false
        generateNumbers(globalWidth, globalHeight)
    }

    if (cell.flag) {
        return
    }

    if (gameOver.value || win.value) {
        return
    }

    if (cell.bomb) {
        dimAllBombs()
        gameOver.value = true
    }

    if (!cell.dimmed) {
        cellCount.value -= 1
    }

    if (cell.dimmed) {
        return checkAdjacentCells(cell)
    }

    cell.dimmed = true
    moves.value++

    if (cell.val === 0) {
        autoClear(cell)
    }

    if (cellCount.value === 0) {
        win.value = true
    }
}

function dimAllBombs() {
    grid.forEach(row => {
        row.forEach(cell => {
            if (cell.bomb && !cell.flag) cell.dimmed = true;
        })
    })
}

function autoClear(cell: CellType) {
    const {r, l, br, b, bl, tr, t, tl} = getAdjacentTiles(cell)

    if (r && !r.dimmed) dimCell(r)
    if (l && !l.dimmed) dimCell(l)

    if (br && !br.dimmed) dimCell(br)
    if (b && !b.dimmed) dimCell(b)
    if (bl && !bl.dimmed) dimCell(bl)

    if (tr && !tr.dimmed) dimCell(tr)
    if (t && !t.dimmed) dimCell(t)
    if (tl && !tl.dimmed) dimCell(tl)
}

export function markFlag(cell: CellType) {
    if (gameOver.value || win.value || cell.dimmed) return
    if (!cell.flag) {
        flags.value -= 1
    } else {
        flags.value += 1
    }

    cell.flag = !cell.flag
}

function generateGrid(width: number, height: number) {
    for (let i = 0; i < height; i++) {
        const row: CellType[] = [];

        for (let j = 0; j < width; j++) {
            row.push({
                bomb: false,
                val: 0,
                flag: false,
                dimmed: false,
                fakeDimmed: false,
                row: i,
                col: j,
            });
        }
        grid.push(row);
    }
}

function generateBombs(width: number, height: number, bombs: number) {
    if (!grid) return

    for (let i = 0; i < bombs; i++) {
        let c: number
        let r: number
        do {
            r = getRandomNumber(0, height - 1)
            c = getRandomNumber(0, width - 1)
        }
        while (grid[r][c].bomb)
        {
            grid[r][c].bomb = true
        }
    }
}

function generateNumbers(width: number, height: number) {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (grid[i][j].bomb) {
                const {r, l, br, b, bl, tr, t, tl} = getAdjacentTiles(grid[i][j])

                if (r) r.val++
                if (l) l.val++

                if (grid[i + 1]) { // check bottom row
                    if (br) br.val++
                    if (b) b.val++
                    if (bl) bl.val++
                }

                if (grid[i - 1]) { // check top row
                    if (tr) tr.val++
                    if (t) t.val++
                    if (tl) tl.val++
                }
            }
        }
    }
}

function clearOld() {
    if (grid.length ! > 0) {
        grid.length = 0
        gameOver.value = false
        win.value = false
    }
}

export function initGame(width: number, height: number, bombs: number) {
    clearOld()
    generateGrid(width, height)

    globalWidth = width
    globalHeight = height
    globalBombs = bombs

    flags.value = bombs
    cellCount.value = (width * height) - bombs
    moves.value = 0
}


export class Game {
    public width: number
    public height: number
    public bombs: number

    public grid: CellType[][] = reactive([])

    constructor(width: number, height: number, bombs: number) {
        this.width = width
        this.height = height
        this.bombs = bombs
    }
}
