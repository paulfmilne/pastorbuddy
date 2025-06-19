import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const heading = screen.getByText(/PastorBuddy/i);
  expect(heading).toBeInTheDocument();
});
