// https://github.com/cunzaizhuyi/ds-algorithm/blob/master/%E9%98%9F%E5%88%97/%E4%BC%98%E5%85%88%E9%98%9F%E5%88%97/%E5%A0%86%E5%AE%9E%E7%8E%B0.js

class PriorityQueue{
    // 取父节点索引 ~~((index - 1) / 2)
    constructor(arr){
        if (arr.length){
            this.tree = []
            this._build_tree(arr);
            return;
        }
        this.tree = [];
    }

    // 入队
    enqueue(val){
        this.tree.push(val);
        // 上浮
        this._up(this.tree.length - 1);
    }

    // 出队
    dequeue(){
        // 取树根元素
        this.tree.shift();
        // 最后一个元素放树根，进行下沉
        let last = this.tree.pop();
        this.tree.unshift(last);
        // log(n)下沉
        this._down(0);
    }

    // 取队首的值
    getFirst(){
        return this.tree[0];
    }

    _build_tree(arr){
        let tree = this.tree;
        tree.push(arr[0]);
        for (let i = 1; i < arr.length; i++){
            tree.unshift(arr[i]);
            this._down(0);
        }
    }

    // 对index号元素执行下沉操作. 也叫heapify
    _down(index){
        let tree = this.tree;
        // 本身就是叶子节点，无需下沉
        let last_no_leaf = ~~((tree.length - 2) / 2);
        if (index > last_no_leaf) return;
        while(index <= last_no_leaf){
            let l = tree[index * 2 + 1];
            let r = tree[index * 2 + 2] || tree[index * 2 + 1]; // 有可能没有右儿子
            let max = l.w >= r.w ? l : r;
            let maxIndex = l.w >= r.w ? index * 2 + 1: index * 2 + 2
            if (tree[index] < max){
                [tree[index], tree[maxIndex]] = [tree[maxIndex], tree[index]]
                index = index * 2 + 1
            } else{
                return;
            }
        }
    }

    // 对index号元素执行上浮操作
    _up(index) {
        let tree = this.tree;
        while(index !== 0){
            let p = ~~((index - 1) / 2);
            if (tree[index] > tree[p]){
                [tree[index], tree[p]] = [tree[p], tree[index]];
                // let tmp = index;
                // this._down(tmp);
                index = p;
            } else {
                return;
            }
        }
    }
}

module.exports = PriorityQueue;