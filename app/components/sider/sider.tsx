import useRootStore, { type RootState } from 'app/stores/root';
import { t } from 'app/utils/i18n';
import { NavLink } from 'react-router';

export const Sider = () => {
  const mode = useRootStore((state: RootState) => state.mode);
  const tags = useRootStore((state: RootState) => state.tags);
  const views = useRootStore((state: RootState) => state.views);
  const hints = useRootStore((state: RootState) => state.hints);
  return (
    <>
      <NavLink to={`note/${mode}`}>{t('Note')}</NavLink>
      <NavLink to={`overview`}>{t('Overview')}</NavLink>
      <NavLink to={`hint`}>
        <div>{t('Hint')}</div>
        <div>{hints?.length}</div>
      </NavLink>
      <div>
        {tags.map((tag: any) => (
          <NavLink key={tag.id} to={`tag/${tag.id}`}>
            {tag.name}
          </NavLink>
        ))}
      </div>
      <div>
        {views.map((view: any) => (
          <NavLink key={view.id} to={`view/${view.id}`}>
            {view.name}
          </NavLink>
        ))}
      </div>
      <div>
        <div>{t('Tags Edit')}</div>
        <NavLink to="archive">
          <div>{t('Archive')}</div>
        </NavLink>
      </div>
      <div>
        <NavLink to="ai-setting">AI setting</NavLink>
      </div>
    </>
  );
};

// note 页面和 overview 页面可以设置为首页，设置为首页会置顶
// overview 页面可以将view /提示 /tag 等页面
