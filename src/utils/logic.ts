import {reactive} from "vue";
import {CellType} from "./types";
import {getRandomNumber} from "./getRandomNumber";

export class Game {
    public width: number = 0
    public height: number = 0
    public bombs: number = 0
    public flags: number = 0
    public cellCount: number = 0
    public grid: CellType[][] = reactive([])

    public gameOver: boolean = false
    public win: boolean = false

    public moves: number = 0

    constructor(width: number, height: number, bombs: number) {
        this.width = width
        this.height = height
        this.bombs = bombs
        this.flags = bombs
        this.cellCount = (width * height) - bombs

        this.initGame()
    }

    initGame() {
        this.clearOld()

        this.generateGrid()
    }

    clearOld() {
        if (this.grid.length ! > 0) {
            this.grid.length = 0
            this.moves = 0
            this.gameOver = false
            this.win = false
        }
    }

    generateGrid() {
        for (let i = 0; i < this.height; i++) {
            const row: CellType[] = [];

            for (let j = 0; j < this.width; j++) {
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
            this.grid.push(row);
        }
    }

    clickCell(cell: CellType) {
        if (this.moves === 0) {
            this.grid[cell.row][cell.col].bomb = true
            this.generateBombs()
            this.grid[cell.row][cell.col].bomb = false
            this.generateNumbers()
        }

        if (cell.flag) {
            return
        }

        if (this.gameOver || this.win) {
            return
        }

        if (cell.bomb) {
            this.dimAllBombs()
            this.gameOver = true
        }

        if (!cell.dimmed) {
            this.cellCount -= 1
        }

        if (cell.dimmed) {
            return this.checkAdjacentCells(cell)
        }

        cell.dimmed = true
        this.moves++

        if (cell.val === 0) {
            this.autoClear(cell)
        }

        if (this.cellCount === 0) {
            this.win = true
        }

        console.log(this.moves)
    }

    markFlag(cell: CellType) {
        if (this.gameOver || this.win || cell.dimmed) return
        if (!cell.flag) {
            this.flags -= 1
        } else {
            this.flags += 1
        }

        cell.flag = !cell.flag
    }

    generateBombs() {
        if (!this.grid) return

        for (let i = 0; i < this.bombs; i++) {
            let c: number
            let r: number
            do {
                r = getRandomNumber(0, this.height - 1)
                c = getRandomNumber(0, this.width - 1)
            }
            while (this.grid[r][c].bomb)
            {
                this.grid[r][c].bomb = true
            }
        }
    }

    generateNumbers() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (this.grid[i][j].bomb) {
                    const {r, l, br, b, bl, tr, t, tl} = this.getAdjacentTiles(this.grid[i][j])

                    if (r) r.val++
                    if (l) l.val++

                    if (this.grid[i + 1]) { // check bottom row
                        if (br) br.val++
                        if (b) b.val++
                        if (bl) bl.val++
                    }

                    if (this.grid[i - 1]) { // check top row
                        if (tr) tr.val++
                        if (t) t.val++
                        if (tl) tl.val++
                    }
                }
            }
        }
    }

    getAdjacentTiles(cell: CellType) {
        const r = this.grid[cell.row][cell.col + 1]
        const l = this.grid[cell.row][cell.col - 1]

        let br, b, bl;

        if (this.grid[cell.row + 1]) {
            br = this.grid[cell.row + 1][cell.col + 1]
            b = this.grid[cell.row + 1][cell.col]
            bl = this.grid[cell.row + 1][cell.col - 1]
        }

        let tr, t, tl;

        if (this.grid[cell.row - 1]) {
            tr = this.grid[cell.row - 1][cell.col + 1]
            t = this.grid[cell.row - 1][cell.col]
            tl = this.grid[cell.row - 1][cell.col - 1]
        }

        return {r, l, br, b, bl, tr, t, tl}
    }

    checkAdjacentCells(cell: CellType) {
        const flagsNearCell = this.getAmountOfFlagsAdjacentToCell(cell)
        this.shortDim(cell)

        if (flagsNearCell === cell.val) {
            this.dimAdjacentTiles(cell)
        }
    }

    getAmountOfFlagsAdjacentToCell(cell: CellType) {
        let flagsNearCell = 0;

        const {r, l, br, b, bl, tr, t, tl} = this.getAdjacentTiles(cell)

        if (r && r.flag) flagsNearCell++
        if (l && l.flag) flagsNearCell++

        if (this.grid[cell.row + 1]) { // check bottom row
            if (br && br.flag) flagsNearCell++
            if (b && b.flag) flagsNearCell++
            if (bl && bl.flag) flagsNearCell++
        }

        if (this.grid[cell.row - 1]) { // check top row
            if (tr && tr.flag) flagsNearCell++
            if (t && t.flag) flagsNearCell++
            if (tl && tl.flag) flagsNearCell++
        }

        return flagsNearCell
    }

    dimAllBombs() {
        this.grid.forEach(row => {
            row.forEach(cell => {
                if (cell.bomb && !cell.flag) cell.dimmed = true;
            })
        })
    }

    autoClear(cell: CellType) {
        const {r, l, br, b, bl, tr, t, tl} = this.getAdjacentTiles(cell)

        if (r && !r.dimmed) this.clickCell(r)
        if (l && !l.dimmed) this.clickCell(l)

        if (br && !br.dimmed) this.clickCell(br)
        if (b && !b.dimmed) this.clickCell(b)
        if (bl && !bl.dimmed) this.clickCell(bl)

        if (tr && !tr.dimmed) this.clickCell(tr)
        if (t && !t.dimmed) this.clickCell(t)
        if (tl && !tl.dimmed) this.clickCell(tl)
    }

    shortDim(cell: CellType) {
        this.fakeDim(cell, true)
        setTimeout(() => {
            this.fakeDim(cell, false)
        }, 75)
    }

    dimAdjacentTiles(cell: CellType) {
        const {r, l, br, b, bl, tr, t, tl} = this.getAdjacentTiles(cell)

        if (r && !r.dimmed) this.clickCell(r)
        if (l && !l.dimmed) this.clickCell(l)

        if (this.grid[cell.row + 1]) { // check bottom row
            if (br && !br.dimmed) this.clickCell(br)
            if (b && !b.dimmed) this.clickCell(b)
            if (bl && !bl.dimmed) this.clickCell(bl)
        }

        if (this.grid[cell.row - 1]) { // check top row
            if (tr && !tr.dimmed) this.clickCell(tr)
            if (t && !t.dimmed) this.clickCell(t)
            if (tl && !tl.dimmed) this.clickCell(tl)
        }
    }

    fakeDim(cell: CellType, dimmed: boolean) {
        const {r, l, br, b, bl, tr, t, tl} = this.getAdjacentTiles(cell)

        if (r && !r.flag) r.fakeDimmed = dimmed
        if (l && !l.flag) l.fakeDimmed = dimmed

        if (this.grid[cell.row + 1]) { // check bottom row
            if (br && !br.flag) br.fakeDimmed = dimmed
            if (b && !b.flag) b.fakeDimmed = dimmed
            if (bl && !bl.flag) bl.fakeDimmed = dimmed
        }

        if (this.grid[cell.row - 1]) { // check top row
            if (tr && !tr.flag) tr.fakeDimmed = dimmed
            if (t && !t.flag) t.fakeDimmed = dimmed
            if (tl && !tl.flag) tl.fakeDimmed = dimmed
        }
    }
}
