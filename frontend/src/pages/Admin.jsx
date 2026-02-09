import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, buildFileUrl } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextEditor from "@/components/RichTextEditor";
import { useAuth } from "@/context/AuthContext";

const Admin = () => {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState({});
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [media, setMedia] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);
  const [goals, setGoals] = useState([]);
  const [settings, setSettings] = useState({ gofundme_url: "", social_handle: "@greatworksf", tagline: "" });
  const [reports, setReports] = useState([]);
  const [annualReports, setAnnualReports] = useState([]);
  const [postForm, setPostForm] = useState({ title: "", content: "", status: "draft", scheduled_for: "" });
  const [pageForm, setPageForm] = useState({ slug: "", title: "", content: "", status: "draft" });
  const [eventForm, setEventForm] = useState({ title: "", description: "", start_datetime: "", end_datetime: "", location: "", capacity: 0 });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [goalForm, setGoalForm] = useState({ title: "2024 Recovery Goal", target_amount: 100000 });
  const [integrationForm, setIntegrationForm] = useState({ type: "mailchimp", config: "{}" });
  const [reportForm, setReportForm] = useState({ title: "Annual Report", year: new Date().getFullYear().toString() });
  const [reportFile, setReportFile] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPageId, setEditingPageId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [editingGoalId, setEditingGoalId] = useState(null);

  const fetchAll = async () => {
    const [summaryRes, postsRes, pagesRes, mediaRes, eventsRes, volunteersRes, donorsRes, donationsRes, goalsRes, settingsRes, reportsRes, annualRes] =
      await Promise.all([
        api.get("/analytics/summary"),
        api.get("/posts"),
        api.get("/pages"),
        api.get("/media"),
        api.get("/events"),
        api.get("/volunteers"),
        api.get("/donors"),
        api.get("/donations"),
        api.get("/goals"),
        api.get("/settings"),
        api.get("/reports"),
        api.get("/annual-reports"),
      ]);
    setSummary(summaryRes.data || {});
    setPosts(postsRes.data || []);
    setPages(pagesRes.data || []);
    setMedia(mediaRes.data || []);
    setEvents(eventsRes.data || []);
    setVolunteers(volunteersRes.data || []);
    setDonors(donorsRes.data || []);
    setDonations(donationsRes.data || []);
    setGoals(goalsRes.data || []);
    setSettings(settingsRes.data || settings);
    setReports(reportsRes.data || []);
    setAnnualReports(annualRes.data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const submitPost = async (event) => {
    event.preventDefault();
    if (editingPostId) {
      await api.put(`/posts/${editingPostId}`, postForm);
      toast.success("Post updated");
    } else {
      await api.post("/posts", postForm);
      toast.success("Post created");
    }
    setPostForm({ title: "", content: "", status: "draft", scheduled_for: "" });
    setEditingPostId(null);
    fetchAll();
  };

  const submitPage = async (event) => {
    event.preventDefault();
    if (editingPageId) {
      await api.put(`/pages/${editingPageId}`, pageForm);
      toast.success("Page updated");
    } else {
      await api.post("/pages", pageForm);
      toast.success("Page created");
    }
    setPageForm({ slug: "", title: "", content: "", status: "draft" });
    setEditingPageId(null);
    fetchAll();
  };

  const submitMedia = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Array.from(mediaFiles).forEach((file) => formData.append("files", file));
    formData.append("program_type", "Urban Scholarship");
    await api.post("/media/upload", formData);
    toast.success("Media uploaded");
    setMediaFiles([]);
    fetchAll();
  };

  const submitEvent = async (event) => {
    event.preventDefault();
    if (editingEventId) {
      await api.put(`/events/${editingEventId}`, eventForm);
      toast.success("Event updated");
    } else {
      await api.post("/events", eventForm);
      toast.success("Event created");
    }
    setEventForm({ title: "", description: "", start_datetime: "", end_datetime: "", location: "", capacity: 0 });
    setEditingEventId(null);
    fetchAll();
  };

  const submitGoal = async (event) => {
    event.preventDefault();
    if (editingGoalId) {
      await api.put(`/goals/${editingGoalId}`, { ...goalForm, target_amount: Number(goalForm.target_amount) });
      toast.success("Goal updated");
    } else {
      await api.post("/goals", { ...goalForm, target_amount: Number(goalForm.target_amount) });
      toast.success("Goal added");
    }
    setEditingGoalId(null);
    fetchAll();
  };

  const submitIntegration = async (event) => {
    event.preventDefault();
    await api.post("/integrations", { type: integrationForm.type, config: JSON.parse(integrationForm.config) });
    toast.success("Integration saved");
  };

  const updateSettings = async (event) => {
    event.preventDefault();
    await api.put("/settings", settings);
    toast.success("Settings updated");
  };

  const uploadReport = async (event) => {
    event.preventDefault();
    if (!reportFile) return toast.error("Add a PDF file");
    const formData = new FormData();
    formData.append("title", reportForm.title);
    formData.append("year", reportForm.year);
    formData.append("file", reportFile);
    await api.post("/annual-reports", formData);
    toast.success("Annual report uploaded");
    setReportFile(null);
    fetchAll();
  };

  return (
    <div className="section-gradient" data-testid="admin-dashboard">
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl text-brand-forest">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-brand-muted">Signed in as {user?.name} ({user?.role})</p>
          </div>
          <button onClick={logout} className="rounded-full border border-brand-forest/30 px-5 py-2 text-sm text-brand-forest" data-testid="admin-logout">
            Log out
          </button>
        </div>
        <Tabs defaultValue="overview" className="mt-8" data-testid="admin-tabs">
          <TabsList className="flex flex-wrap gap-2" data-testid="admin-tabs-list">
            {[
              "overview",
              "posts",
              "pages",
              "media",
              "events",
              "volunteers",
              "donors",
              "integrations",
              "settings",
              "reports",
            ].map((tab) => (
              <TabsTrigger key={tab} value={tab} data-testid={`admin-tab-${tab}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { label: "Total Donations", value: `$${summary.donations_total || 0}` },
                { label: "Volunteers", value: summary.volunteers || 0 },
                { label: "Newsletter", value: summary.newsletter || 0 },
              ].map((card, index) => (
                <div key={card.label} className="rounded-2xl bg-white/70 p-6" data-testid={`admin-summary-${index}`}>
                  <p className="text-2xl font-semibold text-brand-forest">{card.value}</p>
                  <p className="text-sm text-brand-muted">{card.label}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
            <form className="rounded-2xl bg-white/70 p-6 shadow-sm" onSubmit={submitPost}>
              <h2 className="font-serif text-2xl text-brand-forest">Blog posts (WYSIWYG)</h2>
              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  placeholder="Title"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={postForm.title}
                  onChange={(event) => setPostForm({ ...postForm, title: event.target.value })}
                  data-testid="admin-post-title"
                />
                <RichTextEditor value={postForm.content} onChange={(value) => setPostForm({ ...postForm, content: value })} dataTestId="admin-post-content" />
                <select
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={postForm.status}
                  onChange={(event) => setPostForm({ ...postForm, status: event.target.value })}
                  data-testid="admin-post-status"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
                <input
                  type="datetime-local"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={postForm.scheduled_for}
                  onChange={(event) => setPostForm({ ...postForm, scheduled_for: event.target.value })}
                  data-testid="admin-post-schedule"
                />
                <button type="submit" className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white" data-testid="admin-post-submit">
                  {editingPostId ? "Update post" : "Save post"}
                </button>
              </div>
            </form>
            <div className="mt-6 grid gap-4">
              {posts.map((post) => (
                <div key={post.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-post-${post.id}`}>
                  <p className="font-semibold text-brand-forest">{post.title}</p>
                  <p className="text-xs text-brand-muted">{post.status}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPostId(post.id);
                        setPostForm({ title: post.title, content: post.content, status: post.status, scheduled_for: post.scheduled_for || "" });
                      }}
                      className="rounded-full border border-brand-forest/20 px-3 py-1 text-xs text-brand-forest"
                      data-testid={`admin-post-edit-${post.id}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await api.delete(`/posts/${post.id}`);
                        fetchAll();
                      }}
                      className="rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                      data-testid={`admin-post-delete-${post.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pages" className="mt-6">
            <form className="rounded-2xl bg-white/70 p-6 shadow-sm" onSubmit={submitPage}>
              <h2 className="font-serif text-2xl text-brand-forest">Pages</h2>
              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  placeholder="Slug (e.g. about)"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={pageForm.slug}
                  onChange={(event) => setPageForm({ ...pageForm, slug: event.target.value })}
                  data-testid="admin-page-slug"
                />
                <input
                  type="text"
                  placeholder="Title"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={pageForm.title}
                  onChange={(event) => setPageForm({ ...pageForm, title: event.target.value })}
                  data-testid="admin-page-title"
                />
                <RichTextEditor value={pageForm.content} onChange={(value) => setPageForm({ ...pageForm, content: value })} dataTestId="admin-page-content" />
                <select
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={pageForm.status}
                  onChange={(event) => setPageForm({ ...pageForm, status: event.target.value })}
                  data-testid="admin-page-status"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <button type="submit" className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white" data-testid="admin-page-submit">
                  {editingPageId ? "Update page" : "Save page"}
                </button>
              </div>
            </form>
            <div className="mt-6 grid gap-4">
              {pages.map((page) => (
                <div key={page.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-page-${page.id}`}>
                  <p className="font-semibold text-brand-forest">{page.title}</p>
                  <p className="text-xs text-brand-muted">{page.slug}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPageId(page.id);
                        setPageForm({ slug: page.slug, title: page.title, content: page.content, status: page.status });
                      }}
                      className="rounded-full border border-brand-forest/20 px-3 py-1 text-xs text-brand-forest"
                      data-testid={`admin-page-edit-${page.id}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await api.delete(`/pages/${page.id}`);
                        fetchAll();
                      }}
                      className="rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                      data-testid={`admin-page-delete-${page.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <form className="rounded-2xl bg-white/70 p-6" onSubmit={submitMedia}>
              <h2 className="font-serif text-2xl text-brand-forest">Media library</h2>
              <input type="file" multiple onChange={(event) => setMediaFiles(event.target.files)} className="mt-4" data-testid="admin-media-upload" />
              <button type="submit" className="mt-4 rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white" data-testid="admin-media-submit">
                Upload media
              </button>
            </form>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {media.map((item) => (
                <div key={item.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-media-${item.id}`}>
                  <img src={buildFileUrl(item.optimized_url || item.original_url)} alt={item.filename} className="h-32 w-full rounded-lg object-cover" />
                  <p className="mt-2 text-xs text-brand-muted">{item.filename}</p>
                  <button
                    onClick={async () => {
                      await api.delete(`/media/${item.id}`);
                      fetchAll();
                    }}
                    className="mt-2 rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                    data-testid={`admin-media-delete-${item.id}`}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <form className="rounded-2xl bg-white/70 p-6" onSubmit={submitEvent}>
              <h2 className="font-serif text-2xl text-brand-forest">Events</h2>
              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  placeholder="Title"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={eventForm.title}
                  onChange={(event) => setEventForm({ ...eventForm, title: event.target.value })}
                  data-testid="admin-event-title"
                />
                <textarea
                  placeholder="Description"
                  className="h-28 rounded-lg border border-brand-forest/20 px-4 py-3"
                  value={eventForm.description}
                  onChange={(event) => setEventForm({ ...eventForm, description: event.target.value })}
                  data-testid="admin-event-description"
                />
                <input
                  type="datetime-local"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={eventForm.start_datetime}
                  onChange={(event) => setEventForm({ ...eventForm, start_datetime: event.target.value })}
                  data-testid="admin-event-start"
                />
                <input
                  type="datetime-local"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={eventForm.end_datetime}
                  onChange={(event) => setEventForm({ ...eventForm, end_datetime: event.target.value })}
                  data-testid="admin-event-end"
                />
                <input
                  type="text"
                  placeholder="Location"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={eventForm.location}
                  onChange={(event) => setEventForm({ ...eventForm, location: event.target.value })}
                  data-testid="admin-event-location"
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={eventForm.capacity}
                  onChange={(event) => setEventForm({ ...eventForm, capacity: event.target.value })}
                  data-testid="admin-event-capacity"
                />
                <button type="submit" className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white" data-testid="admin-event-submit">
                  {editingEventId ? "Update event" : "Create event"}
                </button>
              </div>
            </form>
            <div className="mt-6 grid gap-4">
              {events.map((eventItem) => (
                <div key={eventItem.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-event-${eventItem.id}`}>
                  <p className="font-semibold text-brand-forest">{eventItem.title}</p>
                  <p className="text-xs text-brand-muted">Registrations: {eventItem.registration_count}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingEventId(eventItem.id);
                        setEventForm({
                          title: eventItem.title,
                          description: eventItem.description,
                          start_datetime: eventItem.start_datetime,
                          end_datetime: eventItem.end_datetime,
                          location: eventItem.location,
                          capacity: eventItem.capacity,
                        });
                      }}
                      className="rounded-full border border-brand-forest/20 px-3 py-1 text-xs text-brand-forest"
                      data-testid={`admin-event-edit-${eventItem.id}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await api.delete(`/events/${eventItem.id}`);
                        fetchAll();
                      }}
                      className="rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                      data-testid={`admin-event-delete-${eventItem.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="volunteers" className="mt-6">
            <div className="grid gap-4">
              {volunteers.map((volunteer) => (
                <div key={volunteer.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-volunteer-${volunteer.id}`}>
                  <p className="font-semibold text-brand-forest">{volunteer.name}</p>
                  <p className="text-xs text-brand-muted">{volunteer.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <select
                      className="h-9 rounded-lg border border-brand-forest/20 px-3 text-xs"
                      defaultValue={volunteer.status}
                      onChange={async (event) => {
                        await api.put(`/volunteers/${volunteer.id}`, { status: event.target.value, hours_logged: volunteer.hours_logged, notes: "" });
                        fetchAll();
                      }}
                      data-testid={`admin-volunteer-status-${volunteer.id}`}
                    >
                      <option value="applied">Applied</option>
                      <option value="approved">Approved</option>
                      <option value="active">Active</option>
                    </select>
                    <button
                      onClick={async () => {
                        await api.delete(`/volunteers/${volunteer.id}`);
                        fetchAll();
                      }}
                      className="rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                      data-testid={`admin-volunteer-delete-${volunteer.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="donors" className="mt-6">
            <form className="rounded-2xl bg-white/70 p-6" onSubmit={submitGoal}>
              <h2 className="font-serif text-2xl text-brand-forest">Donation goal</h2>
              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  placeholder="Goal title"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={goalForm.title}
                  onChange={(event) => setGoalForm({ ...goalForm, title: event.target.value })}
                  data-testid="admin-goal-title"
                />
                <input
                  type="number"
                  placeholder="Target amount"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={goalForm.target_amount}
                  onChange={(event) => setGoalForm({ ...goalForm, target_amount: event.target.value })}
                  data-testid="admin-goal-target"
                />
                <button type="submit" className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white" data-testid="admin-goal-submit">
                  {editingGoalId ? "Update goal" : "Save goal"}
                </button>
              </div>
            </form>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {goals.map((goal) => (
                <div key={goal.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-goal-${goal.id}`}>
                  <p className="font-semibold text-brand-forest">{goal.title}</p>
                  <p className="text-xs text-brand-muted">Target: ${goal.target_amount}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGoalId(goal.id);
                        setGoalForm({ title: goal.title, target_amount: goal.target_amount });
                      }}
                      className="rounded-full border border-brand-forest/20 px-3 py-1 text-xs text-brand-forest"
                      data-testid={`admin-goal-edit-${goal.id}`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await api.delete(`/goals/${goal.id}`);
                        fetchAll();
                      }}
                      className="rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                      data-testid={`admin-goal-delete-${goal.id}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {donors.map((donor) => (
                <div key={donor.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-donor-${donor.id}`}>
                  <p className="font-semibold text-brand-forest">{donor.name}</p>
                  <p className="text-xs text-brand-muted">Total: ${donor.total_donated}</p>
                  <button
                    onClick={async () => {
                      await api.delete(`/donors/${donor.id}`);
                      fetchAll();
                    }}
                    className="mt-2 rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                    data-testid={`admin-donor-delete-${donor.id}`}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {donations.map((donation) => (
                <div key={donation.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-donation-${donation.id}`}>
                  <p className="font-semibold text-brand-forest">${donation.amount}</p>
                  <p className="text-xs text-brand-muted">{donation.donor_name}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <form className="rounded-2xl bg-white/70 p-6" onSubmit={submitIntegration}>
              <h2 className="font-serif text-2xl text-brand-forest">Integration settings</h2>
              <div className="mt-4 grid gap-3">
                <select
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={integrationForm.type}
                  onChange={(event) => setIntegrationForm({ ...integrationForm, type: event.target.value })}
                  data-testid="admin-integration-type"
                >
                  <option value="mailchimp">Mailchimp</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="sms">SMS Gateway</option>
                  <option value="google_analytics">Google Analytics</option>
                </select>
                <textarea
                  placeholder='{"api_key":""}'
                  className="h-28 rounded-lg border border-brand-forest/20 px-4 py-3"
                  value={integrationForm.config}
                  onChange={(event) => setIntegrationForm({ ...integrationForm, config: event.target.value })}
                  data-testid="admin-integration-config"
                />
                <button type="submit" className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white" data-testid="admin-integration-submit">
                  Save integration
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <form className="rounded-2xl bg-white/70 p-6" onSubmit={updateSettings}>
              <h2 className="font-serif text-2xl text-brand-forest">Site settings</h2>
              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  placeholder="GoFundMe URL"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={settings.gofundme_url}
                  onChange={(event) => setSettings({ ...settings, gofundme_url: event.target.value })}
                  data-testid="admin-settings-gofundme"
                />
                <input
                  type="text"
                  placeholder="Social handle"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={settings.social_handle}
                  onChange={(event) => setSettings({ ...settings, social_handle: event.target.value })}
                  data-testid="admin-settings-social"
                />
                <input
                  type="text"
                  placeholder="Tagline"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={settings.tagline}
                  onChange={(event) => setSettings({ ...settings, tagline: event.target.value })}
                  data-testid="admin-settings-tagline"
                />
                <button type="submit" className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white" data-testid="admin-settings-submit">
                  Update settings
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <form className="rounded-2xl bg-white/70 p-6" onSubmit={uploadReport}>
              <h2 className="font-serif text-2xl text-brand-forest">Annual report upload</h2>
              <div className="mt-4 grid gap-3">
                <input
                  type="text"
                  placeholder="Title"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={reportForm.title}
                  onChange={(event) => setReportForm({ ...reportForm, title: event.target.value })}
                  data-testid="admin-report-title"
                />
                <input
                  type="text"
                  placeholder="Year"
                  className="h-12 rounded-lg border border-brand-forest/20 px-4"
                  value={reportForm.year}
                  onChange={(event) => setReportForm({ ...reportForm, year: event.target.value })}
                  data-testid="admin-report-year"
                />
                <input type="file" onChange={(event) => setReportFile(event.target.files?.[0] || null)} data-testid="admin-report-file" />
                <button type="submit" className="rounded-full bg-brand-forest px-6 py-3 text-sm font-semibold text-white" data-testid="admin-report-submit">
                  Upload report
                </button>
              </div>
            </form>
            <div className="mt-6 grid gap-4">
              {annualReports.map((report) => (
                <div key={report.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-report-${report.id}`}>
                  <a href={buildFileUrl(report.file_url)} className="text-sm text-brand-forest">
                    {report.title} ({report.year})
                  </a>
                  <button
                    onClick={async () => {
                      await api.delete(`/annual-reports/${report.id}`);
                      fetchAll();
                    }}
                    className="mt-2 rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                    data-testid={`admin-report-delete-${report.id}`}
                  >
                    Delete
                  </button>
                </div>
              ))}
              {reports.map((report) => (
                <div key={report.id} className="rounded-xl bg-white/70 p-4" data-testid={`admin-generated-report-${report.id}`}>
                  <p className="text-sm text-brand-muted">{report.period} report</p>
                  <button
                    onClick={async () => {
                      await api.delete(`/reports/${report.id}`);
                      fetchAll();
                    }}
                    className="mt-2 rounded-full border border-brand-red/40 px-3 py-1 text-xs text-brand-red"
                    data-testid={`admin-generated-report-delete-${report.id}`}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Admin;
