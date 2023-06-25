export const runBench = () => {
  let testSentences2 = `mlebsack@gmail.com
desiree.padberg@gmail.com
koch.ebony@gmail.com
rosalyn.will@fahey.com
mario.koss@douglas.info
twunsch@hotmail.com
hudson.berneice@hotmail.com
frederick.wolff@hettinger.biz
lilla.ankunding@stoltenberg.info
shemar.labadie@friesen.biz
reichert.jarod@yahoo.com
boyd.rempel@crona.com
das-ss22@wp.pl
AA!!Wxx.com
koa@@dupa1.pl
dasia05@hotmail.com
crona.demario@gmail.com
hintz.hortense@tremblay.com
sgrady@quigley.info
kevin.halvorson@gmail.com
jgislason@toy.net
becker.cathy@ritchie.org
schaefer.lenna@hammes.net
http://michal@wp.pl
tina.dibbert@reilly.com
rodriguez.manley@oconner.com
carlee63@schumm.com
jacynthe07@hotmail.com
cartwright.cordia@hotmail.com
nikolaus.frederique@yahoo.com
russel.velda@yahoo.com
wjerde@hotmail.com
corine24@padberg.com
satterfield.kurt@fisher.com
cecil.larkin@hotmail.com
goldner.estevan@runte.com
vaughn.conn@cassin.org
raven00@schmidt.biz
lowe.bridget@maggio.com
gleuschke@rempel.com
zella52@bartoletti.info
gilbert99@predovic.com
laurie.champlin@gmail.com
charlene60@bogisich.com
lina.tromp@mertz.com
hallie.schaden@gmail.com
keith.runolfsdottir@kris.com
qwisozk@yahoo.com
schimmel.benny@yahoo.com
dickinson.tierra@yahoo.com
ardith.casper@gmail.com
wilmer.dietrich@gmail.com
jake14@gmail.com
kamren87@hotmail.com
quinten.hoeger@pollich.com
sporer.dominique@hotmail.com
zsteuber@hansen.com
lockman.waylon@yahoo.com
donnell.bogan@cummings.info
rebecca62@gottlieb.com
torphy.noemy@gmail.com
kutch.devan@lindgren.info
brobel@schinner.com
casimir22@bechtelar.com
jerde.norval@gmail.com
atromp@bernhard.com
metz.jesus@hotmail.com
guadalupe.gerhold@hotmail.com
kovacek.libby@krajcik.com
jayne.grant@gmail.com
nigel32@yahoo.com
polly.stehr@yahoo.com
frami.mariam@yahoo.com
ebins@yahoo.com
wreynolds@yahoo.com
karley.haag@yahoo.com
zachariah.zieme@gmail.com
damore.aaliyah@lubowitz.biz
nelda.wolf@yahoo.com
kaylah.smitham@gmail.com
ksteuber@gmail.com
lizeth11@gmail.com
jerod05@gmail.com
harber.lina@christiansen.com
quentin.kulas@hotmail.com
eva.skiles@sipes.info
virgil09@gmail.com
cheyenne86@yahoo.com
cassie90@mccullough.com
hane.rodolfo@spencer.com
carol23@hackett.net
strosin.susana@turner.biz
uhansen@dicki.biz
ronny.white@runolfsdottir.com333
qkihn@krajcik.biz
runte.abigale@hotmail.com
bogisich.adela@gmail.com
kristy.willms@yahoo.comwewefdwe
parisian.eliane@yahoo.com
lesch.justice@weissnat.biz
tsimonis@hotmail.com
nokurwamac
alison24@hotmail.com
hackett.missouri@ohara.com
issac.feeney@bradtke.com`

  let testSentences = String( testSentences2 )
    .split( '\n' )
    .map(( x ) => x.trim())

  const iterations = 6000
  const measure = (
    name : string,
    r : RegExp,
    counter : number,
  ) => {
    const s = Date.now()
    const _iter = iterations / 100
    const result = Array( _iter )
      .fill( 0, 0, _iter )
      .flatMap(( x ) =>
        testSentences.map(( y ) => y.match( r ))
      )
    const resultS = result.filter( Boolean ).length
    const resultF = result.filter(( x ) => !x).length

    testSentences = testSentences.sort(() =>
      Math.random() - 0.5
    )
    const t = (Date.now() - s) / 1000

    // if ( counter && counter % 100 === 0 ) {
    //   console.log(
    //     `[${
    //       ((counter / iterations) * 100).toFixed(
    //         2,
    //       )
    //     } %] ${name} - ${t} s. results success:${
    //       resultS / _iter
    //     } failures:${resultF / _iter}`,
    //     String( r ),
    //   )
    // }
    return t
  }

  const measureG = (
    name : string,
    r : RegExp,
    counter : number,
  ) => {
    const s = Date.now()
    const _iter = iterations / 10
    const result = Array( _iter )
      .fill( 0, 0, _iter )
      .flatMap(( x ) => [ ...testSentences2.matchAll( r ) ])
    const resultS = result.filter( Boolean ).length
    const resultF = result.filter(( x ) => !x).length

    const t = (Date.now() - s) / 1000

    // if ( counter && counter % 10 === 0 ) {
    //   console.log(
    //     `[${
    //       ((counter / iterations) * 100).toFixed(
    //         2,
    //       )
    //     } %] ${name} - ${t} s. results success:${
    //       resultS / _iter
    //     } failures:${resultF / _iter}`,
    //     String( r ),
    //   )
    // }
    return t
  }

  const r0 = /^([\w\d\.+-_]+)@([\w\d\.+-_]+)\.[\w]{2,5}$/i
  // const r0 = /[\w]+:\/\/[^\\/\s?#]+[^\s?#]+(?:\?[^\s#]*)?(?:#[^\s]*)?/gi ;
  const r1 = new RegExp(
    '^([\\w\\d\\.+-_]+)@([\\w\\d\\.+-_]+)\\.[\\w]{2,5}$',
    'i',
  )

  const r0G =
    /^([\w\d\.+-_]+)@([\w\d\.+-_]+)\.[\w]{2,5}$/gim
  // const r0 = /[\w]+:\/\/[^\\/\s?#]+[^\s?#]+(?:\?[^\s#]*)?(?:#[^\s]*)?/gi ;
  const r1G = new RegExp(
    '^([\\w\\d\\.+-_]+)@([\\w\\d\\.+-_]+)\\.[\\w]{2,5}$',
    'igm',
  )

  const r2 = new RegExp( r0 )
  const results : Record<string, number> = {}
  // test
  const more = (
    name : string,
    fn : ( i : number ) => number,
  ) => {
    const benchTime = Array
      .from( [ ...Array( iterations ).fill( 1 ) ] )
      .map(( x, i ) => fn( i ))
      .reduce( ( a, b, i ) => {
        return a + b
      } )
    results[name] = benchTime
    return benchTime
  }

  console.log(
    more( 'r0G', ( i ) => measureG( 'r0G', r0G, i ) ),
  )
  console.log(
    more(
      'Regex obj G',
      ( i ) => measureG( 'Regex obj G', r1G, i ),
    ),
  )
  console.log(
    more( 'r0', ( i ) => measure( 'r0', r0, i ) ),
  )
  console.log(
    more(
      'Regex obj',
      ( i ) => measure( 'Regex obj', r1, i ),
    ),
  )

  // ddone
  return results
}
