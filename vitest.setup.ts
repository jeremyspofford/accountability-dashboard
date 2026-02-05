import '@testing-library/jest-dom';
import React from 'react';

// Make React available globally for JSX
globalThis.React = React;

// Set up test environment variables
process.env.FEC_API_KEY = 'test-api-key';
process.env.CONGRESS_API_KEY = 'test-congress-key';
