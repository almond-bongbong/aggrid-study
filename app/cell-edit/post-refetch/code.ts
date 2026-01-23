export const code = `const { data } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});

const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
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
