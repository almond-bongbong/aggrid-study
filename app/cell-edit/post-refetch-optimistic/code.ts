export const code = `const mutation = useMutation({
  mutationFn: updateUser,
  onMutate: async (variables) => {
    await queryClient.cancelQueries({ queryKey: ['users'] });
    const previous = queryClient.getQueryData(['users']);

    // Optimistic UI update
    queryClient.setQueryData(['users'], (current) =>
      current?.map((row) =>
        row.id === variables.id
          ? { ...row, ...variables.changes }
          : row,
      ),
    );

    return { previous };
  },
  onError: (_error, _variables, context) => {
    // Rollback
    if (context?.previous) {
      queryClient.setQueryData(['users'], context.previous);
    }
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

const onCellEditRequest = (event) => {
  mutation.mutate({
    id: event.data.id,
    changes: { [event.colDef.field]: event.newValue },
  });
};

<AgGridReact
  rowData={data}
  readOnlyEdit
  onCellEditRequest={onCellEditRequest}
/>;`;
