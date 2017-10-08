# react-simpletable

A simple Table component for React with basic sorting / filtering.

## Install

    npm install react-simpletable

## Usage

```js
import { Table, Th } from 'react-simpletable';

const data = [{
  name: 'Doe',
  firstname: 'John',
  mail: 'john.doe@example.com'
}, {
  name: 'Doe',
  firstname: 'Jane',
  mail: 'jane.doe@example.com'
}];

<Table data={data}>
  <Th property="firstname">Firstname</Th>
  <Th property="name">Name</Th>
  <Th property="mail">Mail</Th>
</Table>
```

**Add input filter**

You can prepend an input filter to the table by specifying a `filterBy` prop.

```js
<Table data={data} filterBy="name">
  <Th property="firstname">Firstname</Th>
  <Th property="name">Name</Th>
  <Th property="mail">Mail</Th>
</Table>
```

**Custom cell rendering**

You can define the rendering of specific cell with the `Td` component.

```js
import { Table, Th, Td } from 'react-simpletable';

<Table data={data} filterBy="name">
  <Th property="firstname">Firstname</Th>
  <Th property="name">Name</Th>
  <Th property="mail">Mail</Th>

  <Td property="mail" render={(item) => (
    <p>
      <a href={`mailto:${item.mail}`}>{item.mail}</a>
    </p>
  </Td>
</Table>
```
