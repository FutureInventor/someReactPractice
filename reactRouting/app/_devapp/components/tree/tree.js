
import React, { Component, Fragment } from 'react';
import axios from'axios';
import { Tree, Input } from 'antd';
import { BookOutlined ,  DownOutlined  } from '@ant-design/icons';
import tippy from 'tippy.js';
import './tree.css';
import 'tippy.js/dist/tippy.css';
import { dataList, generateList, getParentKey } from './searchFunctions';
const { Search } = Input;
let treeFinished = [];

class oneTree extends Component {
    state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
     }

    //change state to expand
    onExpand = expandedKeys => {
      this.setState({
        expandedKeys,
        autoExpandParent: false,
      });
    };

    //choose what to expand
    onChange = event => {
      const { value } = event.target;
      const expandedKeys = dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, treeFinished);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      this.setState({
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
      if (!value){
        this.setState({
          expandedKeys: [],
          searchValue: value,
          autoExpandParent: false,
        });
      }
    };

    componentDidMount() {
      //get xlm
      axios.get(`${window.STATIC_URL}/server.xml`,
        { "Content-Type": "application/xml; charset=utf-8" },
        { timeout: 1000 })
        .then(res => {
          const file = res.data;
          this.setState({ file });
        })
      }

    render() {
        //variables
        let tree = [];
        let book = {};
        const { searchValue, expandedKeys, autoExpandParent } = this.state;

        //parse from xlm to json
        var parseString = require('xml2js').parseString;
        parseString(this.state.file, (err, result) => {
            book = { result };
        });

        //json to tree
        function toTree(obj, key, index){
          let tree = { title: "Books", key: '0-0',};
          Object.assign(tree, { children: [] })
          for (let prop of obj.book) {
            console.log(prop.title);
              key = tree.key + "-" + index++;
              tree.children.push({ title: prop.title[0], key: key,
                icon: <BookOutlined />, author: prop.author[0], genre: prop.genre[0],
                price: prop.price[0], description: prop.description[0]});
          }
          console.log(tree);
          return tree;
        }
        if(book.result){
          tree.push(toTree(book.result.catalog, 0, 0));
          treeFinished = [...tree];
          generateList(treeFinished);
        }

        //to generate tree
        const loop = data =>
          data.map(item => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title =
              index > -1 ? (
                <span>
                  {beforeStr}
                  <span className="site-tree-search-value">{searchValue}</span>
                  {afterStr}
                </span>
              ) : (
              <span>{item.title}</span>
              );
            if (item.children) {
              return { title, key: item.key, author: item.author,
                genre: item.genre, price: item.price, description: item.description,
                icon: <BookOutlined />, children: loop(item.children) };
            }
            return {
              title, key: item.key, author: item.author, genre: item.genre,
              icon: <BookOutlined />, price: item.price, description: item.description,
            };
          });

        return (
          <Fragment>
            <div className="dashboard">
                <Search style={{ marginBottom: 8, width: 250 }} placeholder="Search" onChange={this.onChange} />
                <Tree
                  style={{background: '#EFEFEF'}}
                  onExpand={this.onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  treeData={loop(treeFinished)}
                  showIcon
                  switcherIcon={<DownOutlined />}
                />
            </div>
          </Fragment>
        )
    }
}

export default oneTree;