import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });

try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const html = renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: ['/report-preview/2'] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: '/report-preview/:pageId',
          element: React.createElement(App, { mode: 'single' }),
        }),
      ),
    ),
  );

  console.log(html.slice(0, 800));
} finally {
  await server.close();
}
