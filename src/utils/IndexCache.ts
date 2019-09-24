interface TreeNodeParams {
  start: number
  end: number
  index: number
}

export class TreeNode {
  private start: number
  private end: number
  private _index: number
  private _left?: TreeNode
  private _right?: TreeNode

  constructor ({ start, end, index }: TreeNodeParams) {
    this.start = start
    this.end = end
    this._index = index
  }

  get index(): number {
    return this._index
  }

  get left(): TreeNode {
    return this._left
  }

  get right(): TreeNode {
    return this._right
  }

  private get leftHeight () : number {
    return this.left ? this.left.height : 0
  }

  private get rightHeight () : number {
    return this.right ? this.right.height : 0
  }

  get height () : number {
    return Math.max(this.leftHeight, this.rightHeight) + 1
  }

  private rotateRight(): TreeNode {
    if (this.left) {
      const head = this.left
      this._left = this.left.right
      head._right = this
      return head
    }
    return this
  }
  private rotateLeft(): TreeNode {
    if (this.right) {
      const head = this.right
      this._right = this.right.left
      head._left = this
      return head
    }
    return this
  }
  private balanceTree(): TreeNode {
    if (Math.abs(this.leftHeight - this.rightHeight) > 1) {
      return this.leftHeight > this.rightHeight ? this.rotateRight() : this.rotateLeft()
    }
    return this
  }

  add({ start, end, index }: TreeNodeParams): TreeNode {
    if (this.start >= end) {
      this._left = this.left ? this.left.add({ start, end, index }) : new TreeNode({ start, end, index })
    } else if (this.end <= start) {
      this._right = this.right ? this.right.add({ start, end, index }) : new TreeNode({ start, end, index })
    } else if (this.start !== start || this.end !== end || this._index !== index) {
      throw new Error('Collision')
    }
    return this.balanceTree()
  }

  get(pixel: number) : number {
    if (this.start > pixel) {
      return this.left ? this.left.get(pixel) : -1
    } else if (this.end <= pixel) {
      return this.right ? this.right.get(pixel) : -1
    } else {
      return this.index
    }
  }
}

export default class IndexCache {
  private treeNode?: TreeNode

  set (params: TreeNodeParams): void {
    if (!this.treeNode) {
      this.treeNode = new TreeNode(params)
    } else {
      this.treeNode = this.treeNode.add(params)
    }
  }

  get (pixel: number): number {
    return this.treeNode ? this.treeNode.get(pixel) : -1
  }

  has (pixel: number): boolean {
    return this.get(pixel) !== -1
  }
}