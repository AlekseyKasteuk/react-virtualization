import IndexCache, { TreeNode } from './IndexCache'

describe('IndexCache', () => {
  describe('Tree', () => {
    it('From less to greater', () => {
      let tree = new TreeNode({ start: 0, end: 10, index: 0 })
      expect(tree.index).toEqual(0)
  
      tree = tree.add({ start: 10, end: 20, index: 1 })
      expect(tree.right.index).toEqual(1)
  
      tree = tree.add({ start: 20, end: 30, index: 2 })
      expect(tree.index).toEqual(1)
      expect(tree.left.index).toEqual(0)
      expect(tree.right.index).toEqual(2)
  
      tree = tree.add({ start: 30, end: 40, index: 3 })
      expect(tree.right.right.index).toEqual(3)
      
      tree = tree.add({ start: 40, end: 50, index: 4 })
      expect(tree.right.index).toEqual(3)
      expect(tree.right.left.index).toEqual(2)
      expect(tree.right.right.index).toEqual(4)
    })

    it('From greater to less', () => {
      let tree = new TreeNode({ start: 40, end: 50, index: 4 })
      expect(tree.index).toEqual(4)

      tree = tree.add({ start: 30, end: 40, index: 3 })
      expect(tree.left.index).toEqual(3)

      tree = tree.add({ start: 20, end: 30, index: 2 })
      expect(tree.index).toEqual(3)
      expect(tree.left.index).toEqual(2)
      expect(tree.right.index).toEqual(4)

      tree = tree.add({ start: 10, end: 20, index: 1 })
      expect(tree.index).toEqual(3)
      expect(tree.left.index).toEqual(2)
      expect(tree.right.index).toEqual(4)
      expect(tree.left.left.index).toEqual(1)

      tree = tree.add({ start: 0, end: 10, index: 0 })
      expect(tree.index).toEqual(3)
      expect(tree.right.index).toEqual(4)
      expect(tree.left.index).toEqual(1)
      expect(tree.left.left.index).toEqual(0)
      expect(tree.left.right.index).toEqual(2)
    })
  })

  it('From less to greater', () => {
    const indexCache = new IndexCache()

    indexCache.set({ start: 0, end: 10, index: 0 })
    indexCache.set({ start: 10, end: 20, index: 1 })
    indexCache.set({ start: 20, end: 30, index: 2 })
    indexCache.set({ start: 30, end: 40, index: 3 })
    indexCache.set({ start: 40, end: 50, index: 4 })

    expect(indexCache.get(0)).toEqual(0)
    expect(indexCache.get(9)).toEqual(0)
    expect(indexCache.get(10)).toEqual(1)
    expect(indexCache.get(19)).toEqual(1)
    expect(indexCache.get(20)).toEqual(2)
    expect(indexCache.get(29)).toEqual(2)
    expect(indexCache.get(30)).toEqual(3)
    expect(indexCache.get(39)).toEqual(3)
    expect(indexCache.get(40)).toEqual(4)
    expect(indexCache.get(49)).toEqual(4)
    expect(indexCache.get(50)).toEqual(-1)
  })

  it('From greater to less', () => {
    const indexCache = new IndexCache()

    indexCache.set({ start: 40, end: 50, index: 4 })
    indexCache.set({ start: 30, end: 40, index: 3 })
    indexCache.set({ start: 20, end: 30, index: 2 })
    indexCache.set({ start: 10, end: 20, index: 1 })
    indexCache.set({ start: 0, end: 10, index: 0 })

    expect(indexCache.get(0)).toEqual(0)
    expect(indexCache.get(9)).toEqual(0)
    expect(indexCache.get(10)).toEqual(1)
    expect(indexCache.get(19)).toEqual(1)
    expect(indexCache.get(20)).toEqual(2)
    expect(indexCache.get(29)).toEqual(2)
    expect(indexCache.get(30)).toEqual(3)
    expect(indexCache.get(39)).toEqual(3)
    expect(indexCache.get(40)).toEqual(4)
    expect(indexCache.get(49)).toEqual(4)
    expect(indexCache.get(50)).toEqual(-1)
  })
})