
const icons = {
  'back':'🧮',
   'front':'🦄',
   'app':'🚀',
   'lib':'📚',
   'service':'💻',
   'conf':'⚙️',
   'shared':'📦',
   'type':'🔧',
   'default':'❓'
}
const regex = /([\w\s_\-\.]+)(?:-|_|\/)?(front|back|backend|frontend|app|lib|service|config|conf|shared|type)s?(?:-|_|\/)?/ig
const sanitizeRexex = /[^\w\s]+/ig
const sanitize = (text)=>text.replaceAll(sanitizeRexex, ' ').toLocaleUpperCase().trim()
/**
 * Group items based on their source, name, and whether they are pinned or not.
 *
 * @param {Array<{src: string | undefined, name: string, isPinned: boolean}>} items - The array of items to group.
 * @return {Array<Group>} An array of group objects containing items with the same source.
 */
const groupItems = ()=> {
  const tabsElements = [...document.querySelectorAll('.tabs-and-actions-container .tab')].map(e=>({element:e, src:e.getAttribute('title'), name: e.getAttribute('data-resource-name'), isPinned: [...e.classList].includes('sticky')  }))
  const groups= {}
  const pinnedItems= []
  const otherGroupName = '🎁 Other'

  tabsElements.forEach(item => {
    if (item.isPinned) {
      pinnedItems.push(item)
      return
    }

    let groupName = `${otherGroupName}`
    const matches = [...item.src.matchAll(regex)]
    let match = matches.pop()
    console.log('\n')
    console.log('testing', item.src)
    console.log({matches})
console.log('taking: ', match)
console.log({match})
    if (match) {
      const type = match[2] ?? match[0]
      const icon = Object.entries(icons).find(([name])=>type.toLowerCase().toLowerCase().includes(name))[1]
   groupName = `${icon?icon:icons.default} ${sanitize(match[1])} ${sanitize(type)}`.trim()
   console.log({groupName})

    } else if (item.src) {
      let srcParts = item.src.split('/')
      let srcIndex = srcParts.indexOf('src')

      if (srcIndex > -1 && srcIndex < srcParts.length - 1) {
        groupName = srcParts[srcIndex - 1] || groupName
      }
    }

    if (!groups[groupName]) {
      groups[groupName] = {
        name: groupName,
        items: []
      }
    }

    groups[groupName].items.push(item)
  })
  const results = []
  const otherResult =[]
  if (pinnedItems.length > 0) {
    results.push( [
      '📌 Pinned',
     pinnedItems
    ])
  } else {
    console.log('NO PINNED')
  }
  for(const {name,items} of Object.values(groups)) {
    if(name!==otherGroupName){
      console.log(`add ${name} to result`)

    results.push([name,items])
  } else {
    console.log(`add ${name} to otherResult`)

    otherResult.push([name,items])
  }
  }
  const orderedResults = [...results, ...otherResult];
const htmlResults = orderedResults.map(([name, items]) => {
  const groupNameBtn = `<div style="border: 1px solid #b2d167; padding: 5px; border-radius: 5px; background-color: #69764d; color:white;">
    ${name}
  </div>`;
  const groupTabs = items.map(item => `<div>${item.element.innerHTML}</div>`).join('');
  return `<div style="display: flex; flex-wrap: wrap;">
    ${groupNameBtn}${groupTabs}
  </div>`;
}).join('');


  console.log([...results, ...otherResult])
  document.querySelector('.tabs-and-actions-container').innerHTML = htmlResults

  return htmlResults
}

// setTimeout(() => {
//   groupItems()
// },4000)

// const x = groupItems([{src:'/Work/nano/acrocharge/package.json', name:"package", isPinned:false },
// {src:'/Work/nano/acrocharge/libs/front/shared/constants/src/libgeneral.ts', name:"general", isPinned:false },
// {src:'/Work/nano/acrocharge/front/console/pagesindex.tsx', name:"index", isPinned:false },
// {src:'/Work/nano/acrocharge/front/console/publicdupa.png', name:"dupa", isPinned:false },

// {src:'/Work/nano/acrocharge/front/consolepackage.json', name:"package", isPinned:true },

// {src:'/Work/nano/acrocharge/apps/services/apis/merchant-data-apideploy.yml', name:"deploy", isPinned:false },
// {src:'/Work/nano/acrocharge/apps/services/apis/merchant-data-api/pages/api/v1/extra-dataindex.ts', name:"index", isPinned:false },

// {src:'/work/apps/calculator/srcindex.tsx', name:"index", isPinned:false },
//   {src:'/work/libs/shared/calculator-lib/src/libgetPlus.ts', name:"getPlus", isPinned:false },
//   {src:'/work/libs/shared/calculator-app/src/componentsshow.tsx', name:"show", isPinned:false },
//   {src:'/work/app/services/calculator-serviceserve.ts', name:"serve", isPinned:true },
//   {src:'/work/apps/font/calculator/srcindex.tsx', name:"index", isPinned:false },
//   {src:'/work/apps/font/calculator/src/publicicon.png', name:"icon", isPinned:false },
//   {src:'/work/apps/font/calculator/src/componentsc1.ts', name:"c1", isPinned:false },
//   {src:'/work/apps/calculator/srcmain.ts', name:"main", isPinned:false },
//   {src:'/work/libs/calculator-service/sharedlib.ts', name:"lib", isPinned:false },
//   {src:'/work/libs/calculator-app/maindothings.ts', name:"dothings", isPinned:false },
//   {src:'/work/config/app-calculator/maindothings.ts', name:"dothings", isPinned:false },
//   {src:'/work/types/calculator/maindothings.ts', name:"dothings", isPinned:false },
//   {src:'/work/libs/calculator.app/componentswrap.tsx', name:"wrap", isPinned:false },
//   {src:'/work/libs/calculator-app/componentsstyle.css', name:"style", isPinned:false }

// ])
// console.log(x)
// console.log(x.map(item => item.name))
// console.log(JSON.stringify(x.map(item => ([item.name, item.items.map(i => i.src)])), null,2))

