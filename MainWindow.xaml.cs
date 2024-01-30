using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace SetDown
{
    public partial class MainWindow : Window
    {
        private readonly ModalWindow AlertWindow;
        private readonly ComplexCounter Counter;
        private readonly List<string> RadioButtons = new() { "RadioButton0", "RadioButton1", "RadioButton2", "RadioButton3", "RadioButton4", "RadioButton5" };
        private readonly List<int> TimeoutList = new() { 1800, 3600, 5400, 7200, 9000, 10800 };

        private Thread CountDown;

        private int countSelected;

        private int DisplaySelected = 0;
        private int DisplayCount = 1;

        public MainWindow()
        {
            InitializeComponent();

            this.AlertWindow = new ModalWindow { Topmost = true };

            this.AlertWindow.ButtonClicked += Check_Modal;

            this.Counter = new ComplexCounter(this.countSelected, this.AlertWindow, this);

            this.CountDown = new Thread(ThreadCounter);

            UpdateTimeouts(sender: null, @event: null);
        }

        private void UpdateTimeouts(object? sender, EventArgs? @event)
        {
            StreamReader file;

            try { file = new("timeouts.conf"); }
            catch (Exception) { return; }

            for (int i = 0; i < this.RadioButtons.Count; i++)
            {
                int timeout = GetTimeout(file);

                this.TimeoutList[i] = timeout;

                ConfigureRadioButton(this.RadioButtons[i], timeout);
            }
        }

        private static int GetTimeout(StreamReader file)
        {
            string? line = file.ReadLine();

            return line == null ? 0 : int.Parse(line);
        }

        private void ConfigureRadioButton(string radiobuttonName, int timeout)
        {
            Counter count = new(timeout);

            RadioButton radiobutton = Application.Current.Dispatcher.Invoke(() => (RadioButton)FindName(radiobuttonName));

            TextBlock textblock = Application.Current.Dispatcher.Invoke(() => (TextBlock)radiobutton.Content);

            Application.Current.Dispatcher.Invoke(() => textblock.Text = count.ToString());
        }

        private void DragWindow(object sender, MouseButtonEventArgs e)
        {
            if (Application.Current.Dispatcher.Invoke(() => e.ChangedButton == MouseButton.Left)) DragMove();
        }

        private void CloseApplication(object sender, RoutedEventArgs e)
        {
            Application.Current.Shutdown();
        }

        private void MinimizeWindow(object sender, RoutedEventArgs e)
        {
            this.WindowState = WindowState.Minimized;
        }

        private void SetConfig(object sender, RoutedEventArgs e)
        {
            Process updating = Process.Start("notepad.exe", "timeouts.conf");

            updating.EnableRaisingEvents = true;

            updating.Exited += new EventHandler(UpdateTimeouts);
        }

        private void ThreadCounter()
        {
            try
            {
                while (true)
                {
                    Thread.Sleep(999);
                    UpdateTimerCounter(this.Counter.Next());
                }
            }
            catch (ThreadInterruptedException) { }
        }

        private void UpdateTimerCounter(string count)
        {
            if (this.graphCounter.Dispatcher.CheckAccess()) this.graphCounter.Content = count;
            else this.graphCounter.Dispatcher.BeginInvoke(new Action<string>(UpdateTimerCounter), count);
        }

        private void InterruptCounter()
        {
            try { this.CountDown.Interrupt(); }
            catch (Exception) { }

            this.Counter.Cancel();
            Privilege(() => this.owl.Visibility = Visibility.Hidden);
            Privilege(() => this.clock.Visibility = Visibility.Visible);
        }

        private void CancelTimeout(object sender, RoutedEventArgs e)
        {
            InterruptCounter();

            UpdateTimerCounter(this.Counter.ToString());

            this.countSelected = 0;

            UnselectRadioButtons();

            this.BorderCounter.Visibility = Visibility.Hidden;
        }

        private void AcceptTimeout(object sender, RoutedEventArgs e)
        {
            if (this.countSelected == 0) return;

            InterruptCounter();

            this.Counter.SetCounter(this.countSelected);

            this.CountDown = new Thread(ThreadCounter);

            this.CountDown.Start();

            this.BorderCounter.Visibility = Visibility.Hidden;

            if (this.countSelected <= 600) Privilege(() => this.AlertWindow.Show());
        }

        private void SetTimer(object sender, RoutedEventArgs e)
        {
            if (this.CountDown.IsAlive) return;

            if (sender is not RadioButton radioButton) return;

            int index = int.Parse(radioButton.Name[^1..]);

            this.countSelected = this.TimeoutList[index];

            this.Counter.SetCounter(this.countSelected);

            UpdateTimerCounter(this.Counter.ToString());
        }

        private void Check_Modal(object? sender, EventArgs e)
        {
            InterruptCounter();

            UpdateTimerCounter(this.Counter.ToString());

            Focus();
        }

        private void UnselectRadioButtons()
        {
            this.RadioButtons.ForEach(button => Uncheck(button));
        }

        private void Uncheck(string button)
        {
            RadioButton? radioButton = (RadioButton)FindName(button);
            radioButton.IsChecked = false;
        }


        private void AddToCounter(object sender, RoutedEventArgs e)
        {
            if (this.CountDown.IsAlive) return;

            if (Selector_notVisible()) return;

            this.countSelected += this.DisplayCount;
            this.Counter.SetCounter(this.countSelected);
            UpdateTimerCounter(this.Counter.ToString());
        }

        private void SubstractFromCounter(object sender, RoutedEventArgs e)
        {
            if (this.CountDown.IsAlive) return;

            if (Selector_notVisible()) return;

            if (this.countSelected <= 0) return;
            this.countSelected -= this.DisplayCount;
            this.Counter.SetCounter(this.countSelected);
            UpdateTimerCounter(this.Counter.ToString());
        }

        private void LeftDisplay(object sender, RoutedEventArgs e)
        {
            if (this.CountDown.IsAlive) return;

            if (Selector_notVisible()) return;

            this.DisplaySelected++;
            this.DisplaySelected %= 3;
            UpdateTimerDisplay();
        }

        private void RightDisplay(object sender, RoutedEventArgs e)
        {
            if (this.CountDown.IsAlive) return;

            if (Selector_notVisible()) return;

            this.DisplaySelected--;
            if (this.DisplaySelected == -1) this.DisplaySelected = 2;
            UpdateTimerDisplay();
        }

        private bool Selector_notVisible()
        {
            if (this.BorderCounter.Visibility == Visibility.Hidden)
            {
                this.DisplaySelected = 0;

                UpdateTimerDisplay();

                this.BorderCounter.Visibility = Visibility.Visible;

                return true;
            }

            return false;
        }


        private void UpdateTimerDisplay()
        {
            switch (this.DisplaySelected)
            {
                case 0: //right
                    this.DisplayCount = 1;
                    this.BorderCounter.Margin = new Thickness(225, 65, 0, 0);
                    break;

                case 1: //mid
                    this.DisplayCount = 60;
                    this.BorderCounter.Margin = new Thickness(-5, 65, 0, 0);
                    break;

                case 2: //left
                    this.DisplayCount = 3600;
                    this.BorderCounter.Margin = new Thickness(-235, 65, 0, 0);
                    break;
            }
        }


        private static void Privilege(Action accion)
        {
            Application.Current.Dispatcher.Invoke(accion);
        }
    }
}