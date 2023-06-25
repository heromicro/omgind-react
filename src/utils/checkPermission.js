// eslint-disable-next-line import/prefer-default-export
export function checkActionPermission(menuPaths, code) {
  if (menuPaths && code) {
    const item = menuPaths[window.location.pathname];
    if (item && item.actions) {
      const { actions } = item;
      for (let i = 0; i < actions.length; i += 1) {
        if (actions[i].code === code) {
          return true;
        }
      }
    }
  }
  return false;
}
