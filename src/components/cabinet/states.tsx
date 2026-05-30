export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <article className="card empty-state">
      <h2>{title}</h2>
      <p>{text}</p>
    </article>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <article className="card error-state">
      <h2>Не удалось загрузить данные</h2>
      <p>{message}</p>
    </article>
  )
}
