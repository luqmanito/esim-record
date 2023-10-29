const collectNodes = (xs) =>
  xs.flatMap(({ id, allowed, children = [] }) => [
    { id, allowed },
    ...collectNodes(children),
  ]);

const collectEdges = (xs) =>
  xs.flatMap(({ id: from, children = [] }) => [
    ...children.map(({ id: to }) => ({ from, to })),
    ...collectEdges(children),
  ]);

const collect = (items) => ({
  nodes: collectNodes(items),
  edges: collectEdges(items),
});

export default collect;
