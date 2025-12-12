import { createFileRoute } from '@tanstack/react-router'
import { Main } from '@/components/layout/main'
import { DishDetails } from '@/features/dishes/components/dish-details'
import { DishesProvider } from '@/features/dishes/components/dishes-provider'

export const Route = createFileRoute('/_authenticated/dishes/$id')({
  component: DishShow,
  head: (ctx) => {
    return {
      meta: [
        {
          title: "Dish Details",
        },
      ],
    };
  },
})

function DishShow() {
  const { id } = Route.useParams()

  return (
    <DishesProvider>
      <Main>
        <DishDetails dishId={id} />
      </Main>
    </DishesProvider>
  )
}
