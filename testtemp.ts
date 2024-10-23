enum StatusCodes {
  NotFound = 404,
  Success = 200,
  Accepted = 202,
  BadRequest = 400,
}

// logs 404
console.log(StatusCodes.NotFound);

// logs 200
console.log(typeof StatusCodes.Success);

enum CardinalDirections {
  North,
  East,
  South,
  West,
}

let currentDirection = CardinalDirections.North;

// North is the first value so it logs '0'
console.log(currentDirection);
