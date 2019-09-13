interface TreeNodeParams {
  start: number
  end: number
  index: number
}

export class TreeNode {
  private start: number
  private end: number
  public index: number
  private left: TreeNode
  private right: TreeNode

  constructor ({ start, end, index }: TreeNodeParams) {
    this.start = start
    this.end = end
    this.index = index
  }

  get leftHeight () : number {
    return this.left ? this.left.height : 0
  }

  get rightHeight () : number {
    return this.left ? this.left.height : 0
  }

  get height () : number {
    return Math.max(this.leftHeight, this.rightHeight) + 1
  }

  private rotateRight() {
    const head = this.left
    this.left = this.left.right
    head.right = this
    return head
  }
  private rotateLeft() {
    const head = this.right
    this.right = this.right.left
    head.left = this
    return head
  }
  private balanceTree() {
    if (Math.abs(this.leftHeight - this.rightHeight) > 1) {
      return this.leftHeight > this.rightHeight ? this.rotateRight() : this.rotateLeft()
    }
    return this
  }

  add(params: TreeNodeParams) {
    const { start, end, index } = params
    if (this.start >= end) {
      if (this.left) {
        this.left.add(params)
      } else {
        this.left = new TreeNode(params)
      }
    } else if (this.end <= start) {
      if (this.right) {
        this.right.add(params)
      } else {
        this.right = new TreeNode(params)
      }
    } else if (this.start !== start || this.end !== end || this.index !== index) {
      throw new Error('Collision')
    }
    return this.balanceTree()
  }

  get(pixel: number) : TreeNode {
    if (this.start > pixel) {
      return this.left ? this.left.get(pixel) : null
    } else if (this.end < pixel) {
      return this.right ? this.right.get(pixel) : null
    } else {
      return this
    }
  }
}

export default class IndexCache {
  private treeNode: TreeNode

  set (params: TreeNodeParams) {
    if (!this.treeNode) {
      this.treeNode = new TreeNode(params)
    } else {
      this.treeNode = this.treeNode.add(params)
    }
  }

  get (pixel: number) {
    return this.treeNode ? this.treeNode.get(pixel) : null
  }

  has (pixel: number) {
    return this.get(pixel) !== null
  }
}