import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { useAppStore } from '@/store/storeZustand'

export default function PrivacyPolicy() {
  const language = useAppStore(state => state.language)
  const isZh = language === 'zh-CN'

  return (
    <>
      <div className="w-full min-h-screen flex flex-col">
        <Header></Header>
        <div className="flex justify-center items-center">
          <div className="text-[40rem] font-bold my-[30rem] tracking-[2rem]">
            {isZh ? '隐私政策' : 'Privacy Policy'}
          </div>
        </div>
        <div className='flex flex-col px-[5%] pb-[50rem]'>
          <div className="mx-auto space-y-[24rem] text-[20rem] leading-[1.8] text-gray-800">
            {isZh ? (
              // 中文内容
              <>
            <p className="mb-[24rem]">
              我们开发了我们的服务，以帮助您提高运营效率。我们理解隐私对我们的在线访问者和注册用户都很重要。我们尊重您的隐私，并将采取合理步骤保护您的信息，如本隐私政策所述。
            </p>

            <p className="mb-[24rem]">
              本隐私政策将帮助您了解以下内容：
            </p>

            <ul className="list-disc list-inside space-y-[8rem] mb-[24rem] ml-[16rem]">
              <li>本隐私政策的适用范围</li>
              <li>信息收集和使用</li>
              <li>信息共享和披露</li>
              <li>选择和退出</li>
              <li>信息保护</li>
              <li>变更和通知</li>
              <li>管辖问题</li>
              <li>信息访问:联系我们</li>
            </ul>

            <p className="mb-[24rem]">
              如果我们的服务条款与本隐私政策之间存在任何不一致，以我们的服务条款为准。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">1. 本隐私政策的适用范围</h2>
            <p className="mb-[24rem]">
              本隐私政策适用于本网站，包括所有子页面和后续页面（统称为"网站"），也适用于我们提供的所有软件和服务，包括您注册账户时我们通过网站提供的服务（统称为"服务"）。
            </p>
            <p className="mb-[24rem]">
              通过使用我们的网站或服务，您即接受本政策中描述的做法。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">2. 信息收集和使用</h2>
            <p className="mb-[24rem]">
              总的来说，我们通过三种方式收集信息：（1）当您直接向我们提供时，（2）当我们从第三方或我们的系统获得关于您的信息时，以及（3）通过"cookies"等技术被动收集。我们收集的信息类型以及我们对这些信息的使用如下所述。
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">个人信息</h3>
            <p className="mb-[16rem]">
              本隐私政策中使用的"个人信息"一词，是指可用于识别或与可识别个人相关的任何信息。个人信息不包括已聚合或匿名化的信息，以至于无法再合理地与特定个人相关联。我们收集的个人信息可能包括：
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[24rem] ml-[16rem]">
              <li>姓名</li>
              <li>电子邮件地址</li>
              <li>电话号码</li>
              <li>信用卡和借记卡号</li>
              <li>账户用户名和安全代码</li>
              <li>任何预订信息</li>
            </ul>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Cookies、Web服务器日志和其他技术</h3>
            <p className="mb-[16rem]">
              与许多商业网站类似，我们利用"cookies"和其他技术在我们的网站上收集信息。"Cookies"是网络浏览器软件的一项功能，允许网络服务器识别用于访问网站的计算机。Cookies存储通过浏览器访问的信息，以简化活动并使在线体验更容易和更个性化。通过cookies和网络服务器日志文件收集的信息可能包括访问日期和时间、查看的页面、IP地址、任何页面的链接以及网站停留时间等信息。
            </p>
            <p className="mb-[16rem]">
              我们使用cookie数据来衡量我们网站的网络流量和使用活动，以改进和增强我们网站的功能，查找可能的欺诈活动，并更好地了解我们网站上的流量和交易来源。Cookies还允许我们的服务器记住您未来的访问账户信息，并在我们网站的相关页面上提供个性化和简化的信息。
            </p>
            <p className="mb-[16rem]">
              为了理解和改进我们广告的有效性，我们可能还使用网络信标、cookies和其他技术来识别您已访问我们网站或看到我们广告之一的事实。如果您不想通过使用cookies收集信息，大多数浏览器允许您自动拒绝cookies，或选择拒绝或接受来自特定网站的特定cookie（或cookies）。您也可以考虑访问aboutcookies.org，它提供有关cookies的有用信息。您可以选择禁用我们网站的cookies，但这可能会限制您使用我们网站和服务的能力。
            </p>
            <p className="mb-[16rem]">
              某些信息由大多数浏览器收集，例如您的媒体访问控制（MAC）地址、计算机类型（Windows或Macintosh）、屏幕分辨率、操作系统名称和版本、语言以及浏览器类型和版本。我们使用此信息以确保网站正常运行。
            </p>
            <p className="mb-[16rem]">
              您的IP地址由您的互联网服务提供商自动分配给您的计算机。每当用户访问网站时，IP地址可能会在我们的服务器日志文件中自动识别和记录，以及访问时间和访问的页面。收集IP地址是标准做法，许多网站、应用程序和其他服务都会自动完成。我们将IP地址用于计算使用水平、诊断服务器问题和管理服务等目的。我们还可以从您的IP地址推断您的大致位置。
            </p>
            <p className="mb-[24rem]">
              我们使用第三方分析服务，例如Google Analytics，这是由Google, Inc.（"Google"）提供的网络分析服务。Google Analytics使用cookies来帮助我们分析用户如何使用网站并增强您使用服务时的体验。有关Google如何使用此数据的更多信息，请访问www.google.com/policies/privacy/partners/。您也可以在此处下载Google Analytics退出浏览器插件。
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">网站访问者</h3>
            <p className="mb-[24rem]">
              要简单地浏览我们的网站，您不需要提供任何个人信息。但是，我们可能会从cookies和类似技术中收集信息，如上所述，目的是监控和改进我们的网站，以及理解和改进我们广告的有效性。
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">网站用户</h3>
            <p className="mb-[16rem]">
              要使用我们的网站和服务，我们收集以下个人信息：
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[16rem] ml-[16rem]">
              <li>您的姓名、公司名称、账单信息（包括信用卡信息）、位置、电子邮件地址、电话号码、签名、预订详情、备注、您在交易过程中提供的其他客人姓名，以完成您对网站的使用。</li>
              <li>您用于访问本平台的IP地址、设备和位置，这些将链接到您的账户以用于欺诈检测/预防目的。</li>
            </ul>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">网站客户</h3>
            <p className="mb-[16rem]">
              要使用我们的网站和服务，您必须注册一个账户。当您注册账户时，我们收集以下个人信息：
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[16rem] ml-[16rem]">
              <li>您的姓名、公司名称、位置、电子邮件地址、电话号码和账户密码、角色和部门、签名</li>
              <li>您用于访问本平台的IP地址、设备和位置，这些将链接到您的账户以用于欺诈检测/预防目的。</li>
            </ul>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">儿童</h3>
            <p className="mb-[24rem]">
              我们的网站和服务不适用于儿童。
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">使用</h3>
            <p className="mb-[16rem]">
              我们可能以符合本隐私政策的方式使用个人信息，用于我们的合法商业利益，包括回应您的询问和满足您的要求、完成您的交易、为您提供客户服务、向您发送管理信息，以及个性化您在网站和服务上的体验。我们还可以使用通过网站或服务收集的个人信息和其他信息来帮助我们改进网站和服务的内容和功能，更好地了解我们的用户并改进网站和服务。我们可能会在未来使用此信息与您联系，告诉您我们认为您会感兴趣的服务。有关如何退出营销通信的信息在下面的第4节（"选择和退出"）中提供。
            </p>
            <p className="mb-[24rem]">
              我们可能出于任何目的使用和披露非个人信息，除非适用法律要求我们以其他方式处理。在某些情况下，我们可能会将非个人信息与个人信息相结合。如果我们这样做，只要信息是组合的，我们就会将组合信息视为个人信息。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">3. 信息共享和披露</h2>
            <p className="mb-[16rem]">
              我们可能为本隐私政策中描述的目的披露您的个人信息，包括向提供网站托管、数据分析、支付处理、订单履行、信息技术和相关基础设施提供、客户服务、电子邮件交付、审计和其他服务的第三方服务提供商披露。
            </p>
            <p className="mb-[24rem]">
              此外，在合并、收购、重组、破产或其他类似事件的情况下，我们拥有的任何信息可能会转移给我们的继承人或受让人。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">4. 选择和退出</h2>
            <p className="mb-[24rem]">
              我们可能会偶尔通过电子邮件向您发送有关优惠或新服务的信息。您可以通过在主题行中回复"取消订阅"，或通过此类通信中包含的取消订阅链接来选择退出这些营销电子邮件通信。但是，您将继续收到与您的账户相关的某些电子邮件通信，包括有关交易和您与我们关系的信息。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">5. 信息保护</h2>
            <p className="mb-[24rem]">
              尽管无法保证数据传输100%安全，但我们采取合理步骤保护个人信息。我们维护合理的管理、技术和物理程序来保护存储在我们服务器中的信息，这些服务器主要位于美国。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">6. 变更和通知</h2>
            <p className="mb-[24rem]">
              本隐私政策最后更新于上述日期。我们保留在我们唯一和绝对的自由裁量权下，不时对本隐私政策进行更改的权利。请定期查看本隐私政策以检查更新。当我们在本网站上发布修订后的隐私政策时，任何更改将生效。您在这些更改后使用网站或服务即表示您接受修订后的隐私政策。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">7. 管辖披露</h2>
            <p className="mb-[16rem]">
              网站和服务由我们从美国控制和运营，不旨在使我们受任何州、国家或地区的法律或管辖权的约束，除了美国。您的个人信息可能在我们拥有设施或我们聘请服务提供商的任何国家/地区存储和处理，通过使用网站和服务，您同意将信息转移到您居住国以外的国家，包括美国，这些国家可能具有与您所在国家不同的数据保护规则。在某些情况下，这些其他国家的法院、执法机构、监管机构或安全部门可能有权访问您的个人信息。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">8. 信息访问:联系我们</h2>
            <p className="mb-[16rem]">
              如果您有账户，您可以通过登录您的账户来更新您的账户信息。您也可以通过如下指定的方式联系我们来更新您的个人信息 - 这适用于与我们有交互的所有类型的用户。我们将采取合理步骤更新或更正您之前通过网站或服务提交的个人信息。如果您对我们的隐私政策或信息做法有任何疑问，请随时通过我们的联系方式与我们联系。
            </p>
            <p className="mb-[16rem]">
              本隐私政策不适用于我们在向我们的财产或品牌客户（如酒店和其他酒店组织）提供平台或服务时代表他们处理的信息。我们代表财产或品牌客户处理的信息的使用可能受我们与此类客户的协议约束。如果您对我们代表财产或品牌客户处理的个人信息有疑虑，请将您的疑虑直接告知该财产或品牌。
            </p>
            <p className="mb-[24rem]">
              我们已任命数据保护官，可通过我们的联系方式联系。我们应要求提供数据处理协议。数据处理协议包括标准合同条款（"示范条款"），这是符合GDPR的数据传输机制。
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">中国附录</h2>
            <p className="mb-[16rem]">
              本隐私政策的此中国附录（"附录"）适用于根据中国的《个人信息保护法》及其实施条例和规则（"PIPL"）位于中华人民共和国（"中国"）的个人。本附录是对本隐私政策的补充。如果本附录与本隐私政策的其余部分之间存在任何不一致，本附录在涉及位于中国的个人个人信息方面优先。
            </p>
            <p className="mb-[24rem]">
              就本附录而言，"个人信息"和"处理"这两个术语具有PIPL中给出的各自含义。
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">我们处理的个人信息</h3>
            <p className="mb-[16rem]">
              我们根据本隐私政策第2节"信息收集和使用"中描述的内容收集和处理您的个人信息。您的信用卡和借记卡号、账单信息和账户安全代码可能被视为PIPL下的敏感个人信息，一旦泄露或非法使用，可能会对个人或财产安全造成损害。我们仅为本隐私政策中描述的目的处理您的敏感个人信息，并采取安全措施确保您敏感个人信息的机密性和安全性。
            </p>
            <p className="mb-[16rem]">
              在以下情况下，我们可以在未获得您同意的情况下处理您的个人信息：
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[24rem] ml-[16rem]">
              <li>这是您作为一方的合同订立或履行所必需的；</li>
              <li>这是履行我们的法定义务所必需的；</li>
              <li>这是应对公共卫生紧急情况或保护个人生命、健康或财产所必需的;</li>
              <li>如果此类个人信息已经由您自己或通过其他合法来源公开披露，则根据适用的中国法律在合理范围内处理您的个人信息。</li>
            </ul>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">您的个人信息共享和披露</h3>
            <p className="mb-[16rem]">
              我们为本隐私政策第3节"信息共享和披露"中描述的目的与第三方共享和披露您的个人信息。我们要求接收您个人信息的服务提供商在处理您的个人信息时遵守本隐私政策，并采取安全措施保护您的个人信息。
            </p>
            <p className="mb-[16rem]">
              如果我们需要在合并、收购、重组、破产或其他类似事件的情况下共享您的个人信息，我们将告知您接收您个人信息的接收者的姓名和联系信息。接收者在处理您的个人信息时应遵守本隐私政策。如果接收者的处理方法和目的超出本隐私政策的范围，此类接收者应获得您的同意。
            </p>
            <p className="mb-[24rem]">
              除非我们已获得您的事先同意或公开披露是适用中国法律、具有法律约束力的执法行动或法院命令所要求的，否则我们不会公开披露您的个人信息。
            </p>

            {/* <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">您个人信息的国际转移</h3>
            <p className="mb-[24rem]">
              我们的总部位于美国，"信息共享和披露"部分中描述的一些服务提供商位于中国境外。就"信息收集和使用"部分中描述的个人信息将在境外处理而言，我们仅为此目的进行此类处理。我们将获得您的单独同意或依赖PIPL下可用的其他法律依据进行您个人信息的国际转移。我们还将采用适用的合法转移机制进行此类转移（在PIPL要求的范围内），并采取措施确保海外接收者能够提供PIPL要求的相同保护水平。
            </p> */}

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">安全</h3>
            <p className="mb-[24rem]">
              如果发生安全事件，我们将立即采取补救行动，并在PIPL要求的情况下通知相关政府当局和/或受影响的个人。
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">您的权利</h3>
            <p className="mb-[16rem]">
              您有权访问、更正、限制或反对处理、撤回同意，并获得我们保留的您个人信息的副本。
            </p>
            <p className="mb-[16rem]">
              在以下情况下，如果我们尚未删除您的个人信息，您还有权要求删除您的个人信息：
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[24rem] ml-[16rem]">
              <li>处理目的已实现或无法实现，或您的个人信息对于实现处理目的不再必要；</li>
              <li>我们停止提供服务，或保留期已过期；</li>
              <li>您已撤回同意（如果我们依赖您的同意作为处理您个人信息的法律依据）；</li>
              <li>我们的处理违反适用的中国法律或与您的协议；</li>
              <li>适用中国法律规定的其他情况。</li>
            </ul>
            <p className="mb-[24rem]">
              您可以通过本隐私政策第8节"信息访问:联系我们"中描述的方法行使上述权利。在验证您的身份后，我们将在PIPL要求的时间范围内响应您的请求。
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">儿童信息</h3>
            <p className="mb-[24rem]">
              我们的网站和服务不适用于儿童。除非我们已获得儿童父母或监护人的同意，否则我们不会故意收集14岁以下儿童的个人信息。如果您是父母或监护人，并认为您的孩子在未经您同意的情况下向我们提供了个人信息，请通过我们的联系方式与我们联系。
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">我们保留您个人信息的时间</h3>
            <p className="mb-[24rem]">
              我们将保留您的个人信息，只要有必要实现我们收集它的目的。如果您停止使用我们的网站和服务，我们可能仍需要出于某些原因（例如遵守我们的法律和/或监管义务）在合理的时间内保留您的个人信息。当我们不再需要您的个人信息时，我们将删除或匿名化它。
            </p>
              </>
            ) : (
              // 英文内容
              <>
            <p className="mb-[24rem]">
              We developed our services to help you gain operations efficiency. We understand that privacy is important to both our online visitors and registered users. We respect your privacy and will take reasonable steps to protect your information as described in this Privacy Policy.
            </p>

            <p className="mb-[24rem]">
              This Privacy Policy will help you understand the following:
            </p>

            <ul className="list-disc list-inside space-y-[8rem] mb-[24rem] ml-[16rem]">
              <li>What does this Privacy Policy apply to?</li>
              <li>Information collection and use</li>
              <li>Sharing and disclosure of information</li>
              <li>Choice and opt-out</li>
              <li>Protection of information</li>
              <li>Changes and notifications</li>
              <li>Jurisdictional issues</li>
              <li>Access to information; Contact us</li>
            </ul>

            <p className="mb-[24rem]">
              In the event of any inconsistency between our Terms of Service and this Privacy Policy, our Terms of Service prevail.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">1. What does this Privacy Policy apply to?</h2>
            <p className="mb-[24rem]">
              This Privacy Policy applies to this website, including all subpages and successor pages (collectively referred to as the "Site"), and also applies to all software and services that we offer, including services that we offer through our Site when you register for an account (collectively referred to as the "Services").
            </p>
            <p className="mb-[24rem]">
              By using our Site or Services, you are accepting the practices described in this Policy.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">2. Information collection and use</h2>
            <p className="mb-[24rem]">
              Broadly speaking, we collect information in three ways: (1) when you provide it directly to us, (2) when we obtain information about you from third parties or our systems, and (3) passively through technology such as "cookies." The types of information that we collect and our use of that information are described below.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Personal Information</h3>
            <p className="mb-[16rem]">
              The term "Personal Information", as used in this Privacy Policy, refers to any information that can be used to identify or relates to an identifiable person. Personal information does not include information that has been aggregated or made anonymous such that it can no longer be reasonably associated with a specific person. Personal Information we collect may include:
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[24rem] ml-[16rem]">
              <li>Names</li>
              <li>Email addresses</li>
              <li>Telephone number</li>
              <li>Credit and debit card number</li>
              <li>Account username and security codes</li>
              <li>Any reservation information</li>
            </ul>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Cookies, Web Server Logs and Other Technologies</h3>
            <p className="mb-[16rem]">
              Similar to many commercial websites, we utilize "cookies" and other technologies to collect information in connection with our Site. "Cookies" are a feature of web browser software that allows web servers to recognize the computer used to access a website. Cookies store information accessed through your browser to streamline activities and make the online experience easier and more personalized. Information gathered through cookies and web-server log files may include information such as the date and time of visits, the pages viewed, IP addresses, links to/from any page, and time spent at a site.
            </p>
            <p className="mb-[16rem]">
              We use cookie data to measure web traffic and usage activity on our Site for purposes of improving and enhancing the functionality of our Site, to look for possible fraudulent activity, and to better understand the sources of traffic and transactions on our Site. Cookies also allow our servers to remember your account information for future visits and to provide personalized and streamlined information across related pages on our Site.
            </p>
            <p className="mb-[16rem]">
              In order to understand and improve the effectiveness of our advertising, we may also use web beacons, cookies, and other technology to identify the fact that you have visited our Site or seen one of our advertisements. If you do not want information collected through the use of cookies, most browsers allow you to automatically decline cookies, or be given the choice of declining or accepting a particular cookie (or cookies) from a particular site. You may also consider visiting aboutcookies.org, which provides helpful information about cookies. You can choose to disable cookies for our Site but this may limit your ability to use our Site and Services.
            </p>
            <p className="mb-[16rem]">
              Certain information is collected by most browsers, such as your Media Access Control (MAC) address, computer type (Windows or Macintosh), screen resolution, operating system name and version, language, and browser type and version. We use this information to ensure that the Site functions properly.
            </p>
            <p className="mb-[16rem]">
              Your IP address is automatically assigned to your computer by your Internet Service Provider. An IP address may be identified and logged automatically in our server log files whenever a user accesses the Site, along with the time of the visit and the page(s) that were visited. Collecting IP addresses is standard practice and is done automatically by many websites, applications and other services. We use IP addresses for purposes such as calculating usage levels, diagnosing server problems and administering the Services. We may also derive your approximate location from your IP address.
            </p>
            <p className="mb-[24rem]">
              We use third-party analytics services, such as Google Analytics, a web analytics service provided by Google, Inc. ("Google"). Google Analytics uses cookies to help us analyze how users use the Site and enhance your experience when you use the Service. For more information on how Google uses this data, go to www.google.com/policies/privacy/partners/. You may also download the Google Analytics opt-out browser add on, available here.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Site Visitors</h3>
            <p className="mb-[24rem]">
              To simply browse our Site, you are not required to provide any Personal Information. However, we may gather information from cookies and similar technologies, as described directly above, for the purposes of monitoring and improving our Site and understanding and improving the effectiveness of our advertising.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Site Users, General</h3>
            <p className="mb-[16rem]">
              To use our Site and Service we collect Personal Information such as the following:
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[16rem] ml-[16rem]">
              <li>Your name, company name, billing information (including credit card information), location, email address, phone number, signature, reservation details, notes, names of other guests you provide during the transaction process, to complete your usage of the site.</li>
              <li>Your IP addresses, devices, and locations used to access our platform, which will be linked to your account for fraud detection/prevention purposes.</li>
            </ul>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Site Users, Customers</h3>
            <p className="mb-[16rem]">
              To use our Site and Services, you must register for an account. When you register for an account, we collect Personal Information such as the following:
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[16rem] ml-[16rem]">
              <li>Your name, company name, location, email address, phone number, and account password, role and department, signatures</li>
              <li>Your IP addresses, devices, and locations used to access our platform, which will be linked to your account for fraud detection/prevention purposes.</li>
            </ul>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Children</h3>
            <p className="mb-[24rem]">
              Our Site and Services are not intended for children.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Use</h3>
            <p className="mb-[16rem]">
              We may use Personal Information in a manner that is consistent with this Privacy Policy for our legitimate business interests, including to respond to your inquiries and fulfill your requests, complete your transactions, provide you with customer service, send administrative information to you, and to personalize your experience on the Site and Services. We may also use Personal Information and other information collected through the Site or Services to help us improve the content and functionality of the Site and Services, to better understand our users and to improve the Site and Services. We may use this information to contact you in the future to tell you about services we believe will be of interest to you. Information regarding how to opt-out of marketing communications is provided in Section 4 ("Choice and opt-out") below.
            </p>
            <p className="mb-[24rem]">
              We may use and disclose information that is not Personal Information for any purpose, except where we are required to do otherwise under applicable law. In some instances, we may combine non-Personal Information with Personal Information. If we do, we will treat the combined information as Personal Information as long as it is combined.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">3. Sharing and disclosure of information</h2>
            <p className="mb-[16rem]">
              We may disclose your Personal Information for the purposes described in this Privacy Policy, including to third party service providers who provide services such as website hosting, data analysis, payment processing, order fulfillment, information technology and related infrastructure provision, customer service, email delivery, auditing and other services.
            </p>
            <p className="mb-[24rem]">
              In addition, in the event of a merger, acquisition, reorganization, bankruptcy, or other similar events, any information in our possession may be transferred to our successor or assign.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">4. Choice and opt-out</h2>
            <p className="mb-[24rem]">
              We may occasionally email you with information about offers or new services. You can opt out of these marketing email communications by replying with unsubscribe in the subject line, or via an unsubscribe link included in such communications. However, you will continue to receive certain email communications related to your account including information regarding transactions and your relationship with us.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">5. Protection of information</h2>
            <p className="mb-[24rem]">
              Although no data transmission can be guaranteed to be 100% secure, we take reasonable steps to protect Personal Information. We maintain reasonable administrative, technical, and physical procedures to protect information stored in our servers, which are located primarily in the United States.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">6. Changes and notifications</h2>
            <p className="mb-[24rem]">
              This Privacy Policy was last updated on the date indicated above. We reserve the right, in our sole and absolute discretion, to make changes to this Privacy Policy from time to time. Please review this Privacy Policy periodically to check for updates. Any changes will become effective when we post the revised Privacy Policy on the Site. Your use of the Site or Services following these changes means that you accept the revised Privacy Policy.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">7. Jurisdictional disclosures</h2>
            <p className="mb-[16rem]">
              The Site and Services are controlled and operated by us from the United States and are not intended to subject us to the laws or jurisdiction of any state, country or territory other than that of the United States. Your Personal Information may be stored and processed in any country where we have facilities or in which we engage service providers, and by using the Site and Services you consent to the transfer of information to countries outside of your country of residence, including the United States, which may have data protection rules that are different from those of your country. In certain circumstances, courts, law enforcement agencies, regulatory agencies or security authorities in those other countries may be entitled to access your Personal Information.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">8. Access to information; Contact us</h2>
            <p className="mb-[16rem]">
              If you have an account, you can update your account information by signing into your account. You also can update your Personal Information by contacting us as specified below - applying to all types of users that interact with us. We will take reasonable steps to update or correct Personal Information in our possession that you have previously submitted via the Site or Services. Please also feel free to contact us if you have any questions about our Privacy Policy or information practices.
            </p>
            <p className="mb-[16rem]">
              This Privacy Policy does not apply to information that we process on behalf of our property or brand customers (such as hotels and other hospitality organizations) while providing the platform or services to them. Our use of information that we process on behalf of our property or brand customers may be governed by our agreements with such customers. If you have concerns regarding your personal information that we process on behalf of a property or brand customer, please direct your concerns to that property or brand.
            </p>
            <p className="mb-[24rem]">
              We've appointed a Data Protection Officer, who can be reached through our contact information. We offer Data Processing Agreements upon request. DPAs include standard contractual clauses ("Model Clauses") that are the mechanism for GDPR-compliant data transfer.
            </p>

            <h2 className="text-[36rem] font-bold mt-[32rem] mb-[16rem]">China Addendum</h2>
            <p className="mb-[16rem]">
              This China Addendum ("Addendum") to the Privacy Policy applies to individuals located in the People's Republic of China ("China") pursuant to China's Personal Information Protection Law and its implementing regulations and rules ("PIPL"). This Addendum supplements this Privacy Policy. In case of any inconsistencies between this Addendum and the rest of this Privacy Policy, this Addendum prevails with respect to the personal information of individuals located in China.
            </p>
            <p className="mb-[24rem]">
              For the purpose of this Addendum, the terms "personal information" and "process" have the respective meanings given thereto under the PIPL.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Personal information we process</h3>
            <p className="mb-[16rem]">
              We collect and process your personal information in accordance with what is described under Section 2 "Information collection and use" of this Privacy Policy. Your credit and debit card number, billing information and account security codes may be considered sensitive personal information under the PIPL, which may result in harm of personal or property safety once leaked or illegally used. We only process your sensitive personal information for purposes as described in this Privacy Policy and take security measures to ensure the confidentiality and security of your sensitive personal information.
            </p>
            <p className="mb-[16rem]">
              We may process your personal information without obtaining your consent under the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[24rem] ml-[16rem]">
              <li>It is necessary for the conclusion or performance of a contract to which you are a party;</li>
              <li>It is necessary for the fulfilment of our statutory obligations;</li>
              <li>It is necessary for coping with public health emergencies or for the protection of an individual's life, health or property; and</li>
              <li>Your personal information is processed within a reasonable scope in accordance with applicable Chinese laws if such personal information has already been publicly disclosed by yourselves or through other legal sources.</li>
            </ul>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Sharing and disclosure of your personal information</h3>
            <p className="mb-[16rem]">
              We share and disclose your personal information to third parties for purposes described under Section 3 "Sharing and disclosure of information" of this Privacy Policy. We require our service providers who receive your personal information to process your personal information in compliance with this Privacy Policy and take security measures to protect your personal information.
            </p>
            <p className="mb-[16rem]">
              In the event that we will need to share your personal information in the event of a merger, acquisition, reorganization, bankruptcy, or other similar events, we will inform you of the name and contact information of the recipient of your personal information. The recipient shall comply with this Privacy Policy when processing your personal information. If the recipient's processing methods and purposes fall beyond the scope of this Privacy Policy, such a recipient shall obtain your consent.
            </p>
            <p className="mb-[24rem]">
              We will not publicly disclose your personal information unless we have obtained your prior consent or the public disclosure is required by applicable Chinese laws, legally binding enforcement actions or court orders.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Security</h3>
            <p className="mb-[24rem]">
              In case a security incident occurs, we will take remediation actions immediately and notify relevant government authorities and/or affected individuals, where required under the PIPL.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Your rights</h3>
            <p className="mb-[16rem]">
              You have the right to access, correction, restrict or object to processing, withdrawal of consent, and obtain a copy of your personal information retained by us.
            </p>
            <p className="mb-[16rem]">
              Under the following circumstances, if we have not deleted your personal information, you also have the right to request to delete your personal information:
            </p>
            <ul className="list-disc list-inside space-y-[8rem] mb-[24rem] ml-[16rem]">
              <li>the purposes of processing have been achieved or cannot be achieved, or your personal information is no longer necessary for achieving the purposes of processing;</li>
              <li>we cease to provide our services, or the retention period has expired;</li>
              <li>you have withdrawn your consent (if we rely on your consent as the legal basis to process your personal information);</li>
              <li>our processing is in violation of applicable Chinese laws or the agreements with you; or</li>
              <li>other circumstances as provided under applicable Chinese laws.</li>
            </ul>
            <p className="mb-[24rem]">
              You can exercise your above rights via methods described in Section 8 "Access to information; Contact us" of this Privacy Policy. We will respond to your request within the timeframe required under the PIPL after your identity is verified.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">Children's Information</h3>
            <p className="mb-[24rem]">
              Our Site and Services are not intended for children. We do not knowingly collect personal information of children under the age of 14 unless we have obtained consent from the children's parents or guardians. If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us through our contact information.
            </p>

            <h3 className="text-[32rem] font-semibold mt-[24rem] mb-[12rem]">How long we keep your personal information</h3>
            <p className="mb-[24rem]">
              We will retain your personal information for as long as necessary to fulfil the purpose for which we collected it. If you cease to use our Site and Services, we may still need to retain your personal information for a reasonable period of time for certain reasons (such as to comply with our legal and/or regulatory obligations). When we no longer require your personal information, we will either delete or anonymise it.
            </p>
              </>
            )}
          </div>
        </div>
        <Footer></Footer>
      </div>
    </>
  )
}
