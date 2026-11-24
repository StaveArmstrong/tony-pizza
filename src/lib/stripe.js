import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe('pk_test_51UFk33Rl4ujPoPmbQIEZ3Qk84jap7kGSwdBioZghalYhwixSSgtOpK6NNVfMTKiETqr0AJhvN6hLmqWM5XicYV3O00ML0GPuEJ')

export default stripePromise