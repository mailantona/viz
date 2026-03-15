// rafce - Компонент
// nfn - Функция
// shift + Option + C --- ConsoleLog
import React/* , { useState, useEffect } */ from 'react';
const MyComponent = () => {
  return (
    <>

    </>
  );
};
export default MyComponent;

// filter
items.filter((item) => (item.target === 1 || item.source === 1));

// sort
children: addNewItemsLevel2.sort((a, b) => a.sortid - b.sortid)

// get index
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];
const index3 = users.findIndex(user => user.name === 'Bob'); // Returns 1
// map
const array1 = [1, 4, 9, 16];
const map1 = array1.map((x) => x * 2);
// map 2
const dStepsItems = response.data.data.sort((a, b) => a.year - b.year).map((item, i) => (
  {
    title: item.year,
    subTitle: 'ФИП-' + item.project.fip,
    description: item.name,
  }
));

// forEach
const items = [{ name: 'Anton', age: 30 }, { name: 'Igor', age: 50 }];
const newItems = [];
items.forEach(element => {
  newItems.push({ userName: element.name, userAge: element.age })
});

// async/await ананимная функция
(async () => {
  if (await e.node.children) {
    await e.node.children.forEach(element => {
      updateNode(element.key, (node) => ({
        ...node,
        parentId: 'AppSystemA4Node'
      }));
    })
  }
  await deleteElements({ nodes: [{ id: e.node.key }] })
})();

// map in return
{
  items.map((item, i) => {
    return (
      <Row key={i}>
        <Col span={24} >
          <Checkbox id={item.id} checked={!item.hidden} onChange={(e) => { addDeleteGroup(item, e) }}>{item.data.label} JSON.stringify(item)</Checkbox>
        </Col>
      </Row>
    )
  })
}

// Tree
const newBP = [];
queryTreeBPRes.data.data.forEach(element => {
  const newAPP = [];
  element.applications.forEach(element2 => {
    newAPP.push({
      title: element2.shortName,
      key: element.PROC + '_' + element2.APP
    })
  });
  newBP.push({
    title: element.name,
    key: element.PROC,
    children: newAPP,
  })
})
setTreeBP(newBP)

// Запрос
import axios from "axios";
import qs from 'qs';

import useAppStore from "../../Store";
const { defApiServerUrl, defTheme, defSystemSize } = useAppStore()

const queryProjectJobs = `${defApiServerUrl}/api/project-jobs?` + qs.stringify({
  fields: ['name', 'year', 'descriptions'],
  populate: {
    application: {
      fields: ['shortName'],
    },
    project: {
      fields: ['fip', 'projectName', 'isBasic'],
    },
  },
  filters: {
    application: {
      documentId: {
        $eq: appId,
      }
    }
  },
  pagination: {
    page: 1, // Request the first page
    pageSize: 1000, // 10 items per page
  },
}, {
  encodeValuesOnly: true, // prettify URL
});

axios.get(`${queryProjectJobs}`, {
  headers: {}
}).then(response => {

  /* Обработка результата запроса */
  const dStepsItems = response.data.data.sort((a, b) => a.year - b.year).map((item, i) => (
    {
      title: item.year,
      subTitle: 'ФИП-' + item.project.fip,
      description: item.name,
    }
  ));
  console.log("🚀 ~ showLoading ~ itemList:", dStepsItems)
  //Запись меню в хранилище
  setStepsItems(dStepsItems)

  //Показываем информацию
  setLoading(false);
}).catch(function (error) {
  console.log(error);
  console.log(error.response.data.error);
});

// Много запросов
Promise.all([
  axios.get(queryTreeBP),
]).then(([
  queryTreeBPRes,
]) => {
  console.log("🚀 ~ showLoading ~ queryModelInfoRes:", queryTreeBPRes)
});

// Уникальные значения distinct
const companies = [
  {
    id: 1,
    name: 'Company A',
    employees: [
      { id: 1, name: 'John', role: 'Developer' },
      { id: 2, name: 'Jane', role: 'Designer' }
    ]
  },
  {
    id: 2,
    name: 'Company B',
    employees: [
      { id: 3, name: 'Bob', role: 'Developer' },
      { id: 4, name: 'Alice', role: 'Manager' },
      { id: 1, name: 'John', role: 'Developer' } // Дубликат
    ]
  }
];
// Все уникальные сотрудники по всем компаниям
const allEmployees = companies.flatMap(company => company.employees);
const uniqueEmployees = allEmployees.filter((employee, index, array) =>
  array.findIndex(e => e.id === employee.id) === index
);
console.log(uniqueEmployees);
// [{id: 1, name: 'John', role: 'Developer'}, 
//  {id: 2, name: 'Jane', role: 'Designer'},
//  {id: 3, name: 'Bob', role: 'Developer'},
//  {id: 4, name: 'Alice', role: 'Manager'}]

// Уникальные роли сотрудников
const uniqueRoles = [...new Set(allEmployees.map(emp => emp.role))];
console.log(uniqueRoles);
// ['Developer', 'Designer', 'Manager']


const departments = [
  {
    name: 'Engineering',
    employees: [
      { id: 1, name: 'John', position: 'Developer' },
      { id: 2, name: 'Jane', position: 'Team Lead' }
    ]
  },
  {
    name: 'Marketing',
    employees: [
      { id: 3, name: 'Bob', position: 'Manager' },
      { id: 4, name: 'Alice', position: 'Analyst' }
    ]
  }
];

// Работа с вложенными массивами объектов
const allEmployees2 = departments.flatMap(dept => dept.employees);
console.log(allEmployees2);
// [
//   {id: 1, name: 'John', position: 'Developer'},
//   {id: 2, name: 'Jane', position: 'Team Lead'},
//   {id: 3, name: 'Bob', position: 'Manager'},
//   {id: 4, name: 'Alice', position: 'Analyst'}
// ]

// С преобразованием - добавить название отдела
const employeesWithDept = departments.flatMap(dept =>
  dept.employees.map(emp => ({
    ...emp,
    department: dept.name
  }))
);
console.log(employeesWithDept);
// [
//   {id: 1, name: 'John', position: 'Developer', department: 'Engineering'},
//   {id: 2, name: 'Jane', position: 'Team Lead', department: 'Engineering'},
//   {id: 3, name: 'Bob', position: 'Manager', department: 'Marketing'},
//   {id: 4, name: 'Alice', position: 'Analyst', department: 'Marketing'}
// ]

// js object array to array
let result = objArray.map(a => a.foo);


// 10 - рамки (А4, А3), 

// 21 - Группа (Бизнес-процесс) -           business-processes , 
// 32 - Группа (Просто) -                   application-groups, 

// 43 - Система -                           applications, 
// 54 - Система как COML -                  application-modules


// Запрос
https://csc-jnk.pro.lukoil.com/api/organization-segments?populate=*


// Быстрые команды
Shift + Alt + A - comment /**/
Shift + Alt + Z - comment //
Shift + Alt + C - log

//F2 - переименовать переменную
//npm run dev


//react передача параметров в родительский компонент


// js join two object array by key








//Фильтруем сохраненные ноды по типам для запроса
const docIdDistinct = [...new Set(dNodes?.map(item => item.typeId))].map((item, i) => (
  {
    typeId: item,
    documentIds: dNodes?.filter((el) => (el.typeId === item)).map((it, i) => (it.documentId))
  }
));
console.log("🚀 ~ Applications ~ docIdDistinct:", docIdDistinct)



//Формирование запросов
const queryBP = `${defApiServerUrl}/api/business-processes/?` + qs.stringify({
  fields: ['PROC', 'name'],
  filters: {
    documentId: {
      $in: docIdDistinct.find(item => item.typeId === 21)?.documentIds,
    }
  },
  pagination: {
    page: 1, // Request the first page
    pageSize: 1000, // 10 items per page
    pageCount: 1, // 10 items per page
  },
}, {
  encodeValuesOnly: true, // prettify URL
});
console.log("🚀 ~ Applications ~ queryBP:", queryBP)

const queryGR = `${defApiServerUrl}/api/application-groups/?` + qs.stringify({
  fields: ['GROUP', 'name'],
  filters: {
    documentId: {
      $in: docIdDistinct.find(item => item.typeId === 32)?.documentIds,
    }
  },
  pagination: {
    page: 1, // Request the first page
    pageSize: 1000, // 10 items per page
    pageCount: 1, // 10 items per page
  },
}, {
  encodeValuesOnly: true, // prettify URL
});
console.log("🚀 ~ Applications ~ queryGR:", queryGR)

{
  <Card size="sm" className={cn(
    "h-full w-full shadow-xl overflow-hidden",
    "p-0 gap-0 data-[size=sm]:py-0 data-[size=sm]:gap-0",
    selected ? "border-slate-500 ring-1 ring-slate-500" : "border-border"
  )}>
    <CardHeader className=" pt-2 pb-2">
      <CardTitle>Card Title</CardTitle>
      <CardDescription>Card Description</CardDescription>
      <CardAction>Card Action</CardAction>
    </CardHeader>
    <CardContent className="pt-2">
      <span className="truncate">{data.label}</span>
    </CardContent>
    <CardFooter className="bg-background">
      ssdf
    </CardFooter>
  </Card>
}