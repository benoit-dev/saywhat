import { useEffect, useState } from "react";
import { AccessGate } from "./components/AccessGate";
import { Header } from "./components/Header";
import { Tabs, type TabId } from "./components/Tabs";
import { UserBar } from "./components/UserBar";
import { UserPicker } from "./components/UserPicker";
import { UserContext, loadStoredUser, storeUser, type Person } from "./lib/user";
import { ToastProvider } from "./lib/toast";
import { InfosView } from "./views/InfosView";
import { RepasView } from "./views/RepasView";
import { CoursesView } from "./views/CoursesView";
import { PersosView } from "./views/PersosView";
import { RandoView } from "./views/RandoView";
import { GroupView } from "./views/GroupView";
import { CarsView } from "./views/CarsView";
import { FunView } from "./views/FunView";

export default function App() {
  const [user, setUser] = useState<Person | null>(() => loadStoredUser());
  const [tab, setTab] = useState<TabId>("infos");

  useEffect(() => {
    if (user) storeUser(user);
  }, [user]);

  return (
    <AccessGate>
      <ToastProvider>
        {user === null ? (
          <UserPicker onPick={setUser} />
        ) : (
          <UserContext.Provider value={{ user, setUser }}>
            <Header />
            <UserBar />
            <Tabs active={tab} onChange={setTab} />
            {tab === "infos" && <InfosView />}
            {tab === "repas" && <RepasView />}
            {tab === "courses" && <CoursesView />}
            {tab === "persos" && <PersosView />}
            {tab === "rando" && <RandoView />}
            {tab === "group" && <GroupView />}
            {tab === "cars" && <CarsView />}
            {tab === "fun" && <FunView />}
            <footer className="app-footer">
              <em>Be grateful little bitch</em> · made for the crew · v0.5
            </footer>
          </UserContext.Provider>
        )}
      </ToastProvider>
    </AccessGate>
  );
}
