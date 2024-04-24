export interface Game {
  name: string
  author?: string[]
  year?: number[]
  publisher?: string[]
  type?: string
  location: string
  furtherInformation?: string
  playerCount?: number | [number, number]
  image: string
}

function setStringIfExistent(value: string): string | undefined {
  if (value.trim().length > 0) {
    return value
  }
  return undefined
}

function setArrayIfExistent<T>(value: T[]): T[] | undefined {
  if (value.length > 0) {
    return value
  }
  return undefined
}

export async function parseGames(): Promise<Game[]> {
  const gamesFile = (await import('./Spiele.csv?raw')).default
  console.log(gamesFile)
  const games = gamesFile
    .split('\n')
    .slice(1)
    .map((line) => {
      const [
        name,
        author,
        year,
        publisher,
        type,
        location,
        gameOfTheYear,
        furtherInformation,
        playerCount,
        image
      ] = line.split(';')

      console.log({
        name,
        author,
        year,
        publisher,
        type,
        location,
        gameOfTheYear,
        furtherInformation,
        playerCount,
        image
      })

      if (name.trim().length === 0) {
        throw new Error('Name is missing')
      } else if (location.trim().length === 0) {
        throw new Error(`Location is missing in ${name}`)
      } else if (image.trim().length === 0) {
        throw new Error(`Image is missing in ${name}`)
      }

      let parsedPlayerCount: number | number[] | null = null

      if (playerCount.includes('-')) {
        parsedPlayerCount = playerCount
          .split('-')
          .map((playerCount) => parseInt(playerCount))
          .filter((playerCount) => !Number.isNaN(playerCount))

        if (parsedPlayerCount.length !== 2) {
          throw new Error('Player count is invalid')
        }
      } else if (Number.isNaN(playerCount) && playerCount.trim().length !== 0) {
        throw new Error('Player count is invalid')
      } else {
        parsedPlayerCount = parseInt(playerCount)
      }

      return {
        name,
        author: setArrayIfExistent(author.split(',')),
        year: setArrayIfExistent(year.split(',').map((year) => parseInt(year)))?.filter(
          (year) => !Number.isNaN(year)
        ),
        publisher: setArrayIfExistent(publisher.split(',')),
        type: setStringIfExistent(type),
        location,
        furtherInformation: setStringIfExistent(furtherInformation),
        playerCount: (parsedPlayerCount ?? undefined) as Game['playerCount'],
        image
      }
    })

  return games
}
