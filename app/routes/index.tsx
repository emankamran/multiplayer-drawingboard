import type { MetaFunction } from "@remix-run/node";


import Page from '~/components/Page';



export const meta: MetaFunction = () => {
  return [
    { title: "Multiplayer Drawing Board" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div >
   
    
   
      <Page />
 

     
    
    </div>
  );
}
