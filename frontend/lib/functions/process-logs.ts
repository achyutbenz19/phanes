export function processLogs(log: string) {
  const { event, data } = JSON.parse(log);
  let html;
  let thought;
  if (event === "ui") html = data.html;
  if (event === "thought") thought = data.thought;
  return { html, thought };
}
