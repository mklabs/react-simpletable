const React = require('react');
const moment = require('moment');
const v4 = require('uuid').v4;

const get = (obj, key) => {
  const parts = key.split('.');
  if (parts.length === 1) return obj[key];
  return parts.reduce((result, part) => {
    return result[part];
  }, obj);
};

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      activeFilter: '',
      activeSort: ''
    };

    const keys = this.state.keys = React.Children.toArray(props.children)
      .filter(child => child.type.displayName === 'Th')
      .map(child => child.props.property);

    this.state.sorts = {};
    this.state.sorts = keys.reduce((sorts, key) => {
      sorts[key] = 'asc';
      return sorts;
    }, {});
  }

  componentWillReceiveProps({ data }) {
    this.setState({ data });
    if (this.state.activeFilter) this.filter(this.state.activeFilter)
    if (this.state.activeSort) this.sort(this.state.activeSort)
  }

  sort(key) {
    let { data } = this.state;
    this.setState({ activeSort: key })

    data = data.sort((a, b) => {
      let valueA = get(a, key);
      let valueB = get(b, key);

      if (key === 'date') {
        valueA = moment(valueA, 'LLL');
        valueB = moment(valueB, 'LLL');
        return valueA.isAfter(valueB) ? 1 :
          valueA.isBefore(valueB) ? -1 :
          0;
      }

      if (typeof valueA === 'string') valueA = valueA.toLowerCase();
      if (typeof valueB === 'string') valueB = valueB.toLowerCase();

      if(valueA < valueB) return -1;
      if(valueA > valueB) return 1;
      return 0;
    });

    if (this.state.sorts[key] === 'asc') data = data.reverse();

    const sort = {};
    sort[key] = this.state.sorts[key] === 'desc' ? 'asc' : 'desc';

    this.setState({
      data,
      sorts: Object.assign({}, this.state.sorts, sort)
    });
  }

  filter(value) {
    const { filterBy, data } = this.props;

    if (!value) {
      return this.setState({ data });
    }

    const filtered = data.filter((item) => {
      const toFilter = item[filterBy];
      return toFilter.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    });

    this.setState({ data: filtered });
  }

  classname(key) {
    if (this.state.activeSort !== key) return 'pull-right';
    return `pull-right fa fa-sort-${this.state.sorts[key]}`;
  }

  render () {
    const { data, keys } = this.state;
    const { filterBy } = this.props;

    const children = React.Children.toArray(this.props.children).filter(child => child.type.displayName === 'Th').map((child) => {
      return React.cloneElement(child, {
        sort: this.sort.bind(this),
        classname: this.classname.bind(this)
      });
    });

    const cells = React.Children.toArray(this.props.children).filter(child => child.type.displayName === 'Td');

    return (
      <div className="Table">
        { !!filterBy ? <input className="pull-right" type="text" placeholder="Search..." onChange={(e) => this.filter(e.target.value)} /> : null}
        <table className="table table-hover">
          <thead>
            <tr>
              {children}
            </tr>
          </thead>
          <tbody>
              {data.map(item => {
                return (
                  <tr key={v4()}>
                    {keys.map(key => {
                      const cell = cells.find(cell => cell.props.property === key);
                      const value = get(item, key);

                      if (!cell) return <td key={v4()}>{ value }</td>
                      return React.cloneElement(cell, {
                        key: v4(),
                        item
                      });
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

class Th extends React.Component {
  constructor(props) {
    super(props);
  }

  sort(key) {
    return this.props.sort(key);
  }

  classname(key) {
    return this.props.classname(key);
  }

  render () {
    const { property } = this.props;

    return (
      <th onClick={(e) => this.sort(property)}>{ this.props.children } <i className={this.classname(property)} /></th>
    );
  }
}

class Td extends React.Component {
  render() {
    if (!this.props.render) return (
      <div>
        {this.props.children}
      </div>
    );

    return (
      <td>
        {this.props.render(this.props.item)}
      </td>
    );
  }
}

exports.Table = Table;
exports.Th = Th;
exports.Td = Td;
