export const createNPrimeNumbers = ( n : number ) => {
  const isPrime = ( num : number ) : boolean => {
    // if(    num    %1000_000===0){
    //   console.log(`> len: ${primes.length}, checking ${current}`)
    // }
    if ( num === 2 ) {
      return true
    }
    if ( num < 2 || num % 2 === 0 ) {
      return false
    }
    for ( let i = 3; i <= Math.sqrt( num ); i += 2 ) {
      if ( num % i === 0 ) {
        return false
      }
    }
    return true
  }

  const primes = []
  let current = 2
  // if(    current    %1000_000===0){
  //   console.log(`> len: ${primes.length}, checking ${current}`)
  // }
  while ( primes.length < n ) {
    if ( isPrime( current ) ) {
      primes.push( current )
    }
    current++
  }

  // Return the array of n prime numbers:
  return primes
}
