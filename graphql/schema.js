const { GraphQLObjectType, GraphQLString, GraphQLInt, 
    GraphQLSchema, GraphQLList, GraphQLID, GraphQLNonNull, 
    GraphQLInputObjectType } = require('graphql');
const Car = require('../models/car');

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  })
});

const CarType = new GraphQLObjectType({
  name: 'Car',
  fields: () => ({
    id: { type: GraphQLID },
    brand: { type: GraphQLString },
    model: { type: GraphQLString },
    year: { type: GraphQLInt },
    owner: { type: OwnerType },
  })
});

const OwnerInputType = new GraphQLInputObjectType({
  name: 'OwnerInput',
  fields: {
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    cars: {
      type: new GraphQLList(CarType),
      resolve() {
        return Car.find();
      }
    },
    car: {
      type: CarType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Car.findById(args.id);
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCar: {
      type: CarType,
      args: {
        brand: { type: new GraphQLNonNull(GraphQLString) },
        model: { type: new GraphQLNonNull(GraphQLString) },
        year: { type: new GraphQLNonNull(GraphQLInt) },
        owner: { type: OwnerInputType }
      },
      resolve(parent, args) {
        const car = new Car({
          brand: args.brand,
          model: args.model,
          year: args.year,
          owner: args.owner
        });
        return car.save();
      }
    },
    updateCar: {
      type: CarType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        brand: { type: GraphQLString },
        model: { type: GraphQLString },
        year: { type: GraphQLInt },
        owner: { type: OwnerInputType }
      },
      async resolve(parent, args) {
        return Car.findByIdAndUpdate(
          args.id,
          {
            $set: {
              brand: args.brand,
              model: args.model,
              year: args.year,
              owner: args.owner
            }
          },
          { new: true }
        );
      }
    },
    deleteCar: {
      type: CarType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return Car.findByIdAndDelete(args.id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
